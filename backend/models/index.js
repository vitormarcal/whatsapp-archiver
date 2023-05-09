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

module.exports = {
    Chat,
    Message,
    Parameter,
    sequelize
};
