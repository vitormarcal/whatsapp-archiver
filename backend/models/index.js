const {sequelize} = require('./sequelize')
const {Chat} = require('./chat');
const {Message} = require('./message');
const {Parameter} = require('./parameter');
const {User} = require('./user');
const path = require("path");

Chat.hasMany(Message, {
    foreignKey: 'chatId'
});
Message.belongsTo(Chat, {
    foreignKey: 'chatId',
});


sequelize.sync()
    .then(() => {
        console.log('Modelos sincronizados com sucesso!');
        return insertParameter()
    })
    .catch(err => console.log('Erro ao sincronizar modelos:', err));


function insertParameter() {
    return Parameter.findOne({where: {name: 'SRC_DIR'}}).then(parameter => {
        if (!parameter) return Parameter.create({
            name: 'SRC_DIR',
            value: process.env.SRC_DIR || path.join(__dirname, '../whatsapp/source')
        })
        return parameter
    }).then(parameter => {
        console.log(`${parameter.name}=${parameter.value} saved`);
        Parameter.findOne({where: {name: 'ARCHIVE_DIR'}}).then(parameter => {
            if (!parameter) return Parameter.create({
                name: 'ARCHIVE_DIR',
                value: process.env.ARCHIVE_DIR || path.join(__dirname, '../whatsapp/archive')
            })
            return parameter
        }).then(parameter => {
            console.log(`${parameter.name}=${parameter.value} saved`);
        })
    })
}

module.exports = {
    Chat,
    Message,
    Parameter,
    sequelize,
    User
};
