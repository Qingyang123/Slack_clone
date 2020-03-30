export default (sequelize, DataTypes) => {
    const Channel = sequelize.define('channel', {
        name: DataTypes.STRING,
        public: DataTypes.BOOLEAN,
    }, { underscored: true });

    Channel.associate = (models) => {
        Channel.belongsTo(models.Team, {
            foreignKey: 'teamId',
            field: 'team_id',
        }),
        Channel.belongsToMany(models.User, {
            through: 'channel_member',
            foreignKey: 'channelId',
        })
    };

    return Channel;
};