const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Actor = sequelize.define('Actor', {
  idActor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombreActor: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'actores',
  timestamps: false
});

module.exports = Actor;