const Sequelize = require('sequelize');
const path = require("path");
const databasePath = process.env.WHATSAPP_ARCHIVER_DATABASE_PATH || path.join(__dirname, '../whatsapp_arquiver.sqlite')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath
});


module.exports = {
    sequelize
}