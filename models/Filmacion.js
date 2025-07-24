const { DataTypes } = require('sequelize');
const { sequelize } = require('../sequelize');

const Filmacion = sequelize.define('Filmacion', {
idFilmacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
},
poster: {
    type: DataTypes.STRING,
    allowNull: false
},
titulo: {
    type: DataTypes.STRING,
    allowNull: false
},
idCategoria: {
    type: DataTypes.INTEGER,
    allowNull: false
},
idGenero: {
    type: DataTypes.INTEGER,
    allowNull: false
},
resumen: {
    type: DataTypes.TEXT('long'),
    allowNull: false
},
temporadas: {
    type: DataTypes.STRING,
    allowNull: false
},
duracion: {
    type: DataTypes.STRING,
    allowNull: false
},
trailer: {
    type: DataTypes.STRING,
    allowNull: true
}
}, {
tableName: 'filmaciones',
timestamps: false
});

module.exports = Filmacion