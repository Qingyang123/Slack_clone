import { Op } from 'sequelize';
import { withFilter } from 'apollo-server';
import { requiresAuth, directMessageSubscription } from '../permissions';
import pubsub from '../pubsub';


const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';


export default {
    DirectMessage: {
        sender: (parent, args, { models }) => {
            const { user, userId, senderId } = parent;
            if (user) return user
            return models.User.findOne({ where: { id: senderId } })
        },
    },
    Subscription: {
        newDirectMessage: {
            subscribe: directMessageSubscription.createResolver(withFilter((parent, { teamId, otherUserId } , { models, user }) => {
                return pubsub.asyncIterator(NEW_DIRECT_MESSAGE)            
            },
            (payload, args, { user }) => {
                return payload.teamId === args.teamId && 
                    ((payload.senderId === user.id && payload.receiverId === args.otherUserId) ||
                     (payload.senderId === args.otherUserId && payload.receiverId === user.id));
            }))
        }
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
                pubsub.publish(NEW_DIRECT_MESSAGE, {
                    teamId: args.teamId,
                    senderId: user.id,
                    receiverId: args.receiverId,
                    newDirectMessage: {
                        ...directMessage.dataValues,
                        sender: {
                            username: user.username
                        },
                        createdAt: '' + directMessage.dataValues.createdAt.toString(),
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