import { PubSub, withFilter } from 'apollo-server';
import { requiresAuth } from '../permissions';

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

const isChannelMember = async (channelId, models, user) => {
    // 
    console.log('is part of team?',channelId, user)
    const channel = await models.Channel.findOne({ where: { id: channelId }})
    console.log('a channel', channel.dataValues.teamId, user)

    const member = await models.Member.findOne({where: { teamId: channel.dataValues.teamId , userId: user.id}})
    console.log('a member', member)

    if(!member) {
        console.log("You have to be a member of the team to subscribe to messages")
        return false
    }
    return true
}

export default {
    Message: {
        user: ({ user, userId }, args, { models }) => {
            if (user) return user
            return models.User.findOne({ where: { id: userId } }, { raw: true })
        },
    },
    Subscription: {
        newChannelMessage: {
            subscribe: withFilter(
                (parent, { channelId }, { models, user }) => {
                    console.log('userr in sub', user)
                    isChannelMember(channelId, models, user).then(result => {
                        console.log('the data ', result)
                        if (!result) {
                            throw new Error ("You have to be a member of the team to subscribe to messages")
                            
                        }
                        return result
                    })
                    return pubsub.asyncIterator("NEW_CHANNEL_MESSAGE" );
                },
                (payload, args) => payload.channelId === args.channelId
            )
        }
    },
    Query: {
        messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) => {
            const messages = await models.Message.findAll({ order: [['created_at', 'ASC']], where: { channelId } }, { raw: true });
            // console.log()
            return messages.map(m => ({
                ...m.dataValues,
                createdAt: m.dataValues.createdAt.toString(),
            }))
        })
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const message = await models.Message.create({
                    ...args,
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