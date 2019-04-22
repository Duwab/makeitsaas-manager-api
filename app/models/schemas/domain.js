/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('domain', {
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
        base: {
            type: DataTypes.STRING(255)
        },
        position: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'domain'
    })
};
