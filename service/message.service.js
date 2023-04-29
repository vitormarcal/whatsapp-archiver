const { Chat, Message } = require('../models');

class MessageService {
    constructor() {
        this.save = (messages = [], attachmentPath) => this.saveAll(messages, attachmentPath)
    }

    chatName(messages = []) {
        const authors = [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null)
        authors.sort();
        return authors.join('#');
    }

    async findOrCreateChat(chatName, attachmentPath) {
        const [chat, created] = await Chat.findOrCreate({
            where: { name: chatName },
            defaults: {
                attachmentDir: attachmentPath,
            },
        });
        return [chat, created];
    }

    async saveAll(messages, attachmentPath) {
        try {
            let chatName =  this.chatName(messages);
            const [chat, created] = this.findOrCreateChat(chatName, attachmentPath);

            if (created) {
                console.log(`Chat '${chatName}' created`);
            }


            const messagesToSave = messages.map(messageData => {
                return {
                    author: messageData.author,
                    content: messageData.content,
                    date: messageData.date,
                    attachmentName: messageData.attachment?.fileName,
                    chatId: chat.id
                }
            })

            return await Message.bulkCreate(messagesToSave)
        } catch (error) {
            console.error('Error adding message to chat: ', error);
            throw error

        }
    }

}


module.exports = {
    MessageService
}