/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('environment_configuration', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        environment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'environment',
                key: 'id'
            }
        },
        config_json: {
            type: DataTypes.JSON
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'environment_configuration'
    })
};
