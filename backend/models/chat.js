const { sequelize }  = require('./sequelize')
const { Model, DataTypes } = require('sequelize');

class Chat extends Model {}
Chat.init({
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    attachmentDir: DataTypes.STRING,
}, { sequelize, modelName: 'chat', createdAt: true });

module.exports = { Chat }