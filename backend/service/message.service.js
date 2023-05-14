const { Message, sequelize } = require('../models');
const Sequelize = require("sequelize");


class MessageService {
    async updateAuthorName(chatId, oldName, newName) {
        Message.update({author: newName}, {where: {author: oldName, chatId: chatId}})
            .then(() => {
                console.log('Registros atualizados com sucesso!');
            })
    }

    async findAuthorsByChatId(chatId) {
        return Message.findAll({
            where: {
                chatId: chatId,
                author: {
                    [Sequelize.Op.not]: null
                }
            },
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('author')), 'author']]
        })
    }

}


module.exports = {MessageService}