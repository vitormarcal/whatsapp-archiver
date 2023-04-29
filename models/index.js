const { sequelize } = require('./sequelize')
const { Chat } = require('./chat');
const { Message } = require('./message');

Message.belongsTo(Chat, {
    foreignKey: 'chatId',
});
Chat.hasMany(Message, {
    foreignKey: 'chatId',
});

sequelize.sync()
    .then(() => console.log('Modelos sincronizados com sucesso!'))
    .catch(err => console.log('Erro ao sincronizar modelos:', err));

module.exports = {
    Chat,
    Message
};
