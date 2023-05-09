const { sequelize }  = require('./sequelize')
const { Model, DataTypes } = require('sequelize');

class Parameter extends Model {}
Parameter.init({
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    value: {
        type: DataTypes.STRING,
    },
    attachmentDir: DataTypes.STRING,
}, { sequelize, modelName: 'parameter', createdAt: true });

module.exports = { Parameter }