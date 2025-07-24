const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Genero = sequelize.define('Genero', {
  idGenero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombreGenero: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'generos',
  timestamps: false
});

module.exports = Genero;