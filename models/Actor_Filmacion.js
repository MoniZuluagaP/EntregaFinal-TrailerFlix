const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Actor_Filmacion = sequelize.define('Actor_Filmacion', {
  idFilmacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idActor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'actor_filmacion',
  timestamps: false
});

module.exports = Actor_Filmacion;