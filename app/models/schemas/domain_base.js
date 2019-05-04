/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('domain_base', {
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
            type: DataTypes.STRING(255),
            unique: true
        },
        position: {
            type: DataTypes.INTEGER
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        wildcardSslEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, {
        tableName: 'domain_base'
    })
};
