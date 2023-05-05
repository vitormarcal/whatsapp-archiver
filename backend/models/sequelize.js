const Sequelize = require('sequelize');
const path = require("path");
const databasePath = path.join(__dirname, '../whatsapp_arquiver.sqlite')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath
});


module.exports = {
    sequelize
}