import { tryLogin } from '../auth';
import { requiresAuth } from '../permissions';
import formatErrors from '../formatErrors';


export default {
    User: {
        teams: async (parent, args, { models, user }) => 
            await models.Team.findAll({
                include: [{
                    model: models.User,
                    where: { id: user.id },
                }]   
            }, { raw: true })
    },
    Team: {
        channels:({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } })
    },
    Query: {
        allUsers: (parent, args, { models }) => models.User.findAll(),
        me: requiresAuth.createResolver((parent, { id }, { models, user }) => models.User.findOne({ where: { id: user.id } })),
        // allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) => {
        //     return models.Team.findAll({where: { owner: user.id }}, {raw: true});
        // }),
        // invitedTeams: requiresAuth.createResolver(async (parent, args, { models, user }) => {
        //     return models.Team.findAll({
        //         include: [
        //             {
        //                 model: models.User,
        //                 where: { id: user.id }
        //             }
        //         ]
        //     }, {raw: true});
        // }),
    },
    Mutation: {
        login: (parent, { email, password }, { models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        register: async (parent, args, { models }) => {
            try {
                const user = await models.User.create(args)
                return {
                    ok: true,
                    user
                };
            } catch(err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models)
                }
            }
        },
    }
};