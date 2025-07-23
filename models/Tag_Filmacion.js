const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize'); 

const Tag_Filmacion = sequelize.define('Tag_Filmacion', {
  idFilmacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idTag: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Tag_Filmacion',
  timestamps: false
});

module.exports = Tag_Filmacion;