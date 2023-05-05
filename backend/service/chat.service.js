const {Chat, Message, sequelize} = require('../models');

class ChatService {
    constructor() {

        this.chatName = (messages = []) => [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null).sort().join('#');

        this.findOrCreateChat = async (chatName, attachmentDir, transaction) => {
            console.log(`Chat.findOrCreate chatName: ${chatName}`)
            let chat = await Chat.findOne({where: {name: chatName}});
            if (!chat) {
                chat = await Chat.create({
                    name: chatName,
                    attachmentDir: `${attachmentDir}/${chatName}`
                }, {transaction});
            }
            return chat;
        };
    }

    async saveAll(messages, attachmentPath, chatName) {
        return sequelize.transaction(async (transaction) => {
            return this.findOrCreateChat(chatName || this.chatName(messages), attachmentPath)
                .then(chat => {
                    return {
                        chat,
                        messagesToSave: messages.map(messageData => {
                            return {
                                author: messageData.author,
                                content: messageData.message,
                                date: messageData.date,
                                attachmentName: messageData.attachment?.fileName,
                                chatId: chat.id
                            }
                        })
                    }
                })
                .then(({chat, messagesToSave}) => {
                    console.log(`Message::bulkCreate start, chatName: ${chatName}`)
                    return Message.bulkCreate(messagesToSave, {
                        transaction
                    })
                        .then(messageSaved => messageSaved.map(it => it.toJSON()))
                        .then(it => {
                            return {
                                ...chat.toJSON(),
                                messages: it
                            }
                        })
                })
        })


    }

    async findChat(id) {

        const chat = (await Chat.findByPk(id))?.toJSON()
        if (!chat) return null
        else {
            const countPromise = Message.count({
                where: {
                    chatId: chat.id
                }
            })

            const findLastPromise = Message.findOne({
                where: {
                    chatId: chat.id
                },
                order: [['id', 'DESC']]
            })
            return Promise.all([countPromise, findLastPromise]).then(([amountOfMessages, lastMessage]) => {
                chat['amountOfMessages'] = amountOfMessages
                chat['lastMessage'] = lastMessage
                return chat
            })
        }
    }

    async findMessagesByChatId(chatId) {
        const {count, rows} = await Message.findAndCountAll({
            where: {
                chatId: chatId
            }
        })
        return {
            count,
            data: rows.map(it => it.toJSON())
        }
    }

    async findAll() {
        const {count, rows} = (await Chat.findAndCountAll())
        return {
            count,
            data: rows.map(it => it.toJSON())
        }
    }
}


module.exports = {
    ChatService: ChatService
}