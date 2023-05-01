const {Chat, Message} = require('../models');

class ChatService {
    constructor() {

        this.chatName = (messages = []) => [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null).sort().join('#');

        this.findOrCreateChat = async (chatName, attachmentDir) => (await Chat.findOrCreate({
            where: {name: chatName},
            defaults: {attachmentDir: `${attachmentDir}/${chatName}`},
        }))[0];
    }

    async saveAll(messages, attachmentPath) {
        const chat = await this.findOrCreateChat(this.chatName(messages), attachmentPath);

        const messagesToSave = messages.map(messageData => {
            return {
                author: messageData.author,
                content: messageData.message,
                date: messageData.date,
                attachmentName: messageData.attachment?.fileName,
                chatId: chat.id
            }
        })
        return {
            ...chat.toJSON(),
            messages: (await Message.bulkCreate(messagesToSave)).map(it => it.toJSON())
        }
    }

    async findChat(id) {

        const chat = (await Chat.findByPk(id))?.toJSON()
        if (!chat) return null
        else {
            chat['amountOfMessages'] = await Message.count({
                where: {
                    chatId: chat.id
                }
            })
            return chat
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