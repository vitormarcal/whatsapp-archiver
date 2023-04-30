const {Chat, Message} = require('../models');

class ChatService {
    constructor() {
        this.findChat = async (id) => (await Chat.findByPk(id))?.toJSON();

        this.chatName = (messages = []) => [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null).sort().join('#');

        this.findOrCreateChat = async (chatName, attachmentDir) => (await Chat.findOrCreate({
            where: {name: chatName},
            defaults: {attachmentDir},
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
            messages: (await Message.bulkCreate(messagesToSave)).map(i => i.toJSON())
        }
    }

}


module.exports = {
    ChatService: ChatService
}