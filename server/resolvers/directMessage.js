import { requiresAuth } from '../permissions';
import { Op } from 'sequelize';


export default {
    DirectMessage: {
        sender: (parent, args, { models }) => {
            const { user, userId, senderId } = parent;
            if (user) return user
            return models.User.findOne({ where: { id: senderId } })
        },
    },
    Query: {
        directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, {models, user}) => {
            const messages = await models.DirectMessage.findAll({
                order: [['createdAt', 'ASC']],
                where: { 
                    teamId, 
                    [Op.or]: [{
                        [Op.and]: [{senderId: user.id}, { receiverId: otherUserId}]
                    }, {
                        [Op.and]: [{senderId: otherUserId}, {receiverId: user.id}]
                    }]
                }
            }, { raw: true })
            return messages.map(message => {
                return {
                    ...message.dataValues,
                    created_at: '' + message.dataValues.createdAt,
                }
            })

        })
    },
    Mutation: {
        createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const directMessage = await models.DirectMessage.create({
                    ...args,
                    senderId: user.id
                })
                // pubsub.publish(NEW_CHANNEL_MESSAGE, {
                //     channelId: args.channelId, 
                //     newChannelMessage: {
                //         ...message.dataValues,
                //         createdAt: '' + message.dataValues.createdAt.toString(),
                //     }
                // });
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        })
    }
};