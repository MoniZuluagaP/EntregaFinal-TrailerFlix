const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); 

const Tag = sequelize.define('Tag', {
  idTag: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombreTag: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Tags',
  timestamps: false
});

module.exports = Tag;