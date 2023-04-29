const { sequelize }  = require('./sequelize')
const {Model, DataTypes} = require("sequelize");

class Message extends Model {}
Message.init({
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: DataTypes.STRING,
    attachmentName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: DataTypes.DATE,
    chatId: DataTypes.INTEGER,
}, { sequelize, modelName: 'message' });

module.exports = { Message }