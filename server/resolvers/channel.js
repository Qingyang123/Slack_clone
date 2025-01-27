import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            console.log('here')
            try {
                const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });
                if (team.owner !== user.id) {
                    return {
                        ok: false,
                        errors: [
                            {
                                path: 'name',
                                message: 'You have to be the owner of the team to create channels'
                            }
                        ]
                    }
                }
                // const channel = await models.Channel.create(args);
                // const response = await models.sequelize.transaction(async (transaction) => {

                //     const channel = await models.Channel.create(args, {transaction});
                //     if(!args.public) {
                //         const members = args.members.filter(m=> m !== user.id)
                //         members.push(user.id)
                //         const pcmembers=members.map(m => ({userId: m, channelId: channel.id}))
                //         await models.PCMember.bulkCreate(pcmembers, {transaction})
                //     }
                //     return channel

                // })
                // console.log(response);

                // if(!args.public) {
                //     const members = args.members.filter(m=> m !== user.id)
                //     members.push(user.id)
                //     const pcmembers=members.map(m => ({userId: m, channelId: channel.id}))
                //     await models.PCMember.bulkCreate(pcmembers)
                // }

                // return {
                //     ok: true,
                //     channel
                // }
                const response = await models.sequelize.transaction(async (transaction) => {

                    const channel = await models.Channel.create(args, {transaction});
                    if(!args.public) {
                        const members = args.members.filter(m=> m !== user.id)
                        members.push(user.id)
                        const pcmembers=members.map(m => ({userId: m, channelId: channel.id}))
                        await models.PCMember.bulkCreate(pcmembers, {transaction})
                    }
                    return channel

                })
                

                return {
                  ok: true,
                  channel: response,
                };
            } catch(err) {
                console.log('error');
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models)
                };
            }
        })
    }
};