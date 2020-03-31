import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import _ from 'lodash'

const formatErrors = (e, models) => {
    if (e instanceof Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    return [{ path: 'name', message: 'something went wrong' }];
};


export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        register: async (parent, { ...args, password }, { models }) => {
            try {
                if (password.length < 3 || password.length > 20) {
                    return {
                        ok: false,
                        errors: [{path: 'password', message: 'The password needs to be between 3 and 20 characters long'}]
                    }
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = await models.User.create({
                    ...args, 
                    password: hashedPassword
                })
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