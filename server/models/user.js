export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        }
    }, { underscored: true });

    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: 'userId',
        }),
        User.belongsToMany(models.Channel, {
            through: 'channel_member',
            foreignKey: 'userId',
        })
    };

    return User;
};