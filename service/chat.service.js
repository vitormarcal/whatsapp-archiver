const {Chat, Message} = require('../models');

class ChatService {
    constructor() {
    }

    chatName(messages = []) {
        const authors = [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null)
        authors.sort();
        return authors.join('#');
    }

    async findOrCreateChat(chatName, attachmentDir) {
        return Chat.findOrCreate({
            where: {name: chatName},
            defaults: {attachmentDir},
        }).then(([chat, created]) => {
            if (created) console.log(chat.toJSON())
            return chat
        }).catch(e => {
            console.error(`findOrCreate fails to ${chatName}`, e)
            throw e
        });

    }

    async saveAll(messages, attachmentPath) {
        let chatName = this.chatName(messages);
        const chat = await this.findOrCreateChat(chatName, attachmentPath);

        const messagesToSave = messages.map(messageData => {
            return {
                author: messageData.author,
                content: messageData.message,
                date: messageData.date,
                attachmentName: messageData.attachment?.fileName,
                chatId: chat.id
            }
        })
        const result = chat.toJSON()
        result.messages = (await Message.bulkCreate(messagesToSave)).map(i => i.toJSON())
        return result
    }

}


module.exports = {
    ChatService: ChatService
}