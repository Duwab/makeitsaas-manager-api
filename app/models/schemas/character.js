/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('character', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    tableName: 'character',
    hooks: {
      /*beforeCreate: (instance, options) => {
        console.log('local beforeCreate');
      },
      beforeSave: (instance, options) => {
        console.log('local beforeSave');
      },
      beforeUpdate: (instance, options) => {
        console.log('local beforeUpdate');
      },
      beforeUpsert: (values, options) => {
        console.log('local beforeUpsert');
      },
      beforeDestroy: (instance, options) => {
        console.log('local beforeDestroy');
      }*/
    }
  })
};
