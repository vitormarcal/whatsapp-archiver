const { sequelize } = require('./sequelize')
const { Chat } = require('./chat');
const { Message } = require('./message');
const { Parameter } = require('./parameter');

Chat.hasMany(Message, {
    foreignKey: 'chatId'
});
Message.belongsTo(Chat, {
    foreignKey: 'chatId',
});


sequelize.sync()
    .then(() => console.log('Modelos sincronizados com sucesso!'))
    .catch(err => console.log('Erro ao sincronizar modelos:', err));


const path = require("path");
Parameter.findOrCreate({
    where: {name: 'SRC_DIR'},
    defaults: {
        value: process.env.SRC_DIR || path.join(__dirname, '../whatsapp/source')
    }
}).then(([parameter]) => console.log(`SRC_DIR=${parameter.value}`))
Parameter.findOrCreate({
    where: {name: 'ARCHIVE_DIR'},
    defaults: {
        value: process.env.ARCHIVE_DIR || path.join(__dirname, '../whatsapp/archive')
    }
}).then(([parameter]) => console.log(`ARCHIVE_DIR=${parameter.value}`))

module.exports = {
    Chat,
    Message,
    Parameter,
    sequelize
};
