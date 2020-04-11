import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

export default {
    Query: {
        getTeamMembers: requiresAuth.createResolver(async (parent, { teamId }, { models, user }) => {
            return await models.User.findAll({
                include: [{
                    model: models.Team,
                    where: { id: teamId },
                }]   
            }, { raw: true })
        })
    },
    Mutation: {
        
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const team = await models.Team.create({...args, owner: user.id});
                await models.Channel.create({ name: 'general', public: true, teamId: team.id });
                await models.Member.create({ teamId: team.id, userId: user.id, admin: true });

                return {
                    ok: true,
                    team,
                };
            } catch(err) {
                return {
                    ok: false,
                    errors: formatErrors(err, models)
                };
            }
        }),

        addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
            try {
                const teamPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
                const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });

                const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
                
                if (team.owner !== user.id) {
                    console.log('owner is not user.id');
                    return {
                        ok: false,
                        errors: [{path: 'email', message: 'You cannot add members to the team'}] 
                    }
                }

                if (!userToAdd) {
                    console.log('user not exist');
                    return {
                        ok: false,
                        errors:[{path: 'email', message: 'Could not find user with this email'}] 
                    }
                }
                
                await models.Member.create({ userId: userToAdd.id, teamId });

                return {
                    ok: true
                }
            } catch(err) {
                console.log('catch');
                return {
                    ok: false,
                    errors: formatErrors(err, models)
                };
            }
        }),
    },
    Team: {
        channels:({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
        directMessageMembers: ({ id }, args, { models, user }) =>
            models.sequelize.query(
                'select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId',
                {
                    replacements: { currentUserId: user.id, teamId: id },
                    model: models.User,
                    raw: true,
                },
            ),
    }
};