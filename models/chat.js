const { sequelize }  = require('./sequelize')
const { Model, DataTypes } = require('sequelize');

class Chat extends Model {}
Chat.init({
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    attachmentDir: DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, { sequelize, modelName: 'chat' });

module.exports = { Chat }