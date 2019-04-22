/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('service', {
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
        type: {
            type: DataTypes.STRING(255),
            defaultValue: 'api'
        },
        repository_url: {
            type: DataTypes.STRING(255)
        },
        position: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'service'
    })
};
