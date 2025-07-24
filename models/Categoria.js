const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Categoria = sequelize.define('Categoria', {
  idCategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombreCategoria: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categoria;