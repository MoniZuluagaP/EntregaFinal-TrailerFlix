require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize( process.env.DB_database, process.env.DB_username, process.env.DB_password, {
    host: process.env.DB_host,
    dialect: process.env.DB_dialect,
    port: process.env.DB_PORT,
    define: {timestamps: false}
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log(`Conectado a la base de datos:  ${process.env.DB_database} `);
    } catch (error) {
        console.error ("Error al conectar a la base de datos", error)
    }
}

async function closeConnection(){
    try {
        await sequelize.close();
        console.log ("Conexion cerrada");
     } catch (error) {
        console.error ("Error al cerrar la conexion", error)
     }
}

module.exports = { sequelize, authenticate, closeConnection };