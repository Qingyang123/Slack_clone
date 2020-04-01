import Sequelize from 'sequelize';
import _ from 'lodash';

export default (e, models) => {
    if (e instanceof Sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    return [{ path: 'name', message: 'something went wrong' }];
};