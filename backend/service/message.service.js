const { Message, sequelize } = require('../models');
const Sequelize = require("sequelize");
const {where} = require("sequelize");


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

    async save(id, messageToUpdate) {
        return Message.update(messageToUpdate, {
            where: {
                id: id
            }
        })
    }

    async findById(id) {
        return Message.findOne({where: {id}})
    }

    async searchMessagesByTerm(term, limit = 100, offset = 0) {
        try {
            let messages = [];
            let batch;

            do {
                batch = await Message.findAll({
                    where: {
                        content: {
                            [Sequelize.Op.like]: `%${term}%`
                        }
                    },
                    limit: limit,
                    offset: offset
                });

                messages = messages.concat(batch);
                offset += limit;
            } while (batch.length === limit);

            return messages;
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            throw error;
        }
    }

}


module.exports = {MessageService}