const { Model, DataTypes} = require('sequelize');
const { sequelize } = require('./sequelize')

class User extends Model {
}

User.init({
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
}, { sequelize });

module.exports = {User}