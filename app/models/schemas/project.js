/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('project', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255)
        },
        position: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'project'
    })
};
