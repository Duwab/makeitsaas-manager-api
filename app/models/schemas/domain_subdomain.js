/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    setTimeout(() => {
        // dirty fix
        sequelize.models.domain_subdomain.belongsTo(sequelize.models.domain_base, {
            as : 'domain',
            foreignKey: 'domain_id'
        });
    }, 1000);

    return sequelize.define('domain_subdomain', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        environment_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: 'environment',
                key: 'id'
            }
        },
        domain_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'domain_base',
                key: 'id'
            }
        },
        subdomain: {
            type: DataTypes.STRING(255)
        },
        position: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'domain_subdomain',
        indexes: [
            {
                unique: true,
                fields: ['domain_id', 'subdomain']
            }
        ]
    })
};
