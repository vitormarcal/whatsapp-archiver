const {Chat, Message, sequelize} = require('../models');
const fs = require("fs");

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
        const chat = (await Chat.findOne({
            where: {id: id},
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM messages AS message
                            WHERE 0=0
                                AND message.chatId = chat.id
                        )`),
                        'messagesCount'
                    ]
                ]
            },
            include: [
                {
                    model: Message,
                    attributes: [
                        'id',
                        'content',
                        'createdAt',
                    ],
                    order: [['id', 'DESC']],
                    limit: 1,
                },
            ],
        }))?.toJSON()
        if (!chat) return null
        else {
            chat.lastMessage = chat.messages[0]
            delete chat.messages;
            return chat
        }
    }

    async findMessagesByChatId(chatId, limit, offset) {
        const {count, rows} = await Message.findAndCountAll({
            where: {
                chatId: chatId
            },
            order: [['id', 'desc']],
            limit: limit,
            offset: offset
        })
        return {
            count,
            data: rows.sort((a, b) => a.id - b.id)
        }
    }

    async findAll() {
        const {count, rows} = (await Chat.findAndCountAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM messages AS message
                            WHERE 0=0
                                AND message.chatId = chat.id
                        )`),
                        'messagesCount'
                    ]
                ]
            },
            include: [{
                model: Message,
                order: [['id', 'DESC']],
                limit: 1
            }]
        }))
        return {
            count,
            data: rows.map(chat => {
                const response = chat.toJSON()
                response.lastMessage = response.messages[0];
                delete response.messages;
                return response
            })
        }
    }

    async updateNameById(chatId, newChatName) {
        Chat.update({name: newChatName}, {where: {id: chatId}})
            .then(() => {
                console.log('Registros atualizados com sucesso!');
            })
    }

    async findAttachmentBy(messageId) {
        return Message.findOne({
            where: {id: messageId},
            include: [{model: Chat}]
        }).then(message => {
            if (!message || !message.attachmentName) {
                return null
            }

            const filePath = `${message.chat.attachmentDir}/${message.attachmentName}`

            return new Promise((resolve, reject) => {
                fs.readFile(filePath, (err, dataBuffer) => {
                    if (err) {
                        reject(err);
                    } else {

                        resolve(dataBuffer)
                    }
                })
            });

        });
    }
}


module.exports = {
    ChatService: ChatService
}