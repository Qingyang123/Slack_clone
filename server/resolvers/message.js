import { requiresAuth, requiresTeamAccess } from '../permissions';
import { withFilter } from 'apollo-server';
import pubsub from '../pubsub';


const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) return user
            return models.User.findOne({ where: { id: userId } }, { raw: true })
        },
    },
    Subscription: {
        newChannelMessage: {
            subscribe: requiresTeamAccess.createResolver(withFilter((parent, { channelId } , { models, user }) => {
                return pubsub.asyncIterator("NEW_CHANNEL_MESSAGE" )            
            },
            (payload, args) => {
                return payload.channelId === args.channelId ;
            }))
        }
    },
    Query: {
        messages: requiresAuth.createResolver(async (parent, { channelId, offset }, { models, user }) => {
            const channel = await models.Channel.findOne({raw: true, where: {id: channelId}})

            if (!channel.public) {
                const member = await models.PCMember.findOne({raw: true, where: { channelId, userId: user.id }})
                if(!member) {
                    throw new Error ('Not Authorized')
                }
            }

            const messages = await models.Message.findAll({ order: [['created_at', 'ASC']], where: { channelId }, limit: 10, offset }, { raw: true });
            // console.log()
            return messages.map(m => ({
                ...m.dataValues,
                createdAt: m.dataValues.createdAt.toString(),
            }))
        })
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, { file, ...args }, { models, user }) => {
            try {
                const messageData = args;
                if (file) {
                    console.log(file);
                    messageData.filetype = file.type;
                    messageData.url = file.path;
                }
                const message = await models.Message.create({
                    ...messageData,
                    userId: user.id
                })
                pubsub.publish(NEW_CHANNEL_MESSAGE, {
                    channelId: args.channelId, 
                    newChannelMessage: {
                        ...message.dataValues,
                        createdAt: '' + message.dataValues.createdAt.toString(),
                    }
                });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
};