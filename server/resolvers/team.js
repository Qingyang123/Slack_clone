import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';
import team from '../schema/team';

export default {
    Query: {
        allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            return models.Team.findAll({where: { owner: user.id }}, {raw: true});
        })
    },
    Mutation: {
        
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const team = await models.Team.create({...args, owner: user.id});
                await models.Channel.create({
                    name: 'general',
                    public: true,
                    teamId: team.id
                });

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
                
                return {
                    ok: false,
                    errors: formatErrors(err, models)
                };
            }
        }),
    },
    Team: {
        channels:({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } })
    }
};