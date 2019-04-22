/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('environment', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'project',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(255)
        },
        subdomain: {
            type: DataTypes.STRING(255)
        }
    }, {
        tableName: 'environment'
    })
};
