const Sequelize = require('sequelize');
const {Chat, Message, sequelize} = require('../models');
const path = require("path");
const AdmZip = require("adm-zip");
const {v4: uuidv4} = require('uuid');
const fs = require("fs");

class ChatService {
    constructor() {

        this.chatName = (messages = []) => [...new Set(messages.map(message => message.author))]
            .filter(author => author !== null).sort().join('#');

        this.findOrCreateChat = async (chatName, attachmentDir, transaction) => {
            console.log(`Chat.findOrCreate chatName: ${chatName}`)
            const uuid = uuidv4()
            let chat = await Chat.findOne({where: {name: chatName}});
            if (!chat) {
                chat = await Chat.create({
                    name: chatName,
                    attachmentDir: `${attachmentDir}/${uuid}`
                }, {transaction});
            }
            return chat;
        };
    }

    async export(chatId) {

        return Promise.all(
            [
                this.findChat(chatId),
                Message.findAll({where: {chatId: chatId}, order: [['date', 'asc']],}).then(messages => {
                    return messages.map(it => {
                        const content = it.author ? `${it.author}: ${it.content}` : it.content
                        const date = formatDate(it.date)
                        return `${date} - ${content}`;
                    }).join('\n')
                })
            ]
        ).then(([chat, joinedMessages]) => {
            fs.writeFileSync(chat.attachmentDir + '/WhatsApp Messages.txt', joinedMessages)
            return this.createZipArchive(chat.attachmentDir)
        })
    }

    async createZipArchive(directoryPath) {
        return new Promise((resolve, reject) => {
            // Criar uma instância do AdmZip
            const zip = new AdmZip();

            // Lê todos os arquivos no diretório e adiciona-os ao zip
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    return reject(err);
                }

                const filePaths = files.map((file) => path.join(directoryPath, file));

                Promise.all(
                    filePaths.map((filePath) =>
                        new Promise((resolve, reject) => {
                            fs.stat(filePath, (err, stats) => {
                                if (err) {
                                    return reject(err);
                                }

                                if (stats.isFile()) {
                                    zip.addLocalFile(filePath);
                                }

                                resolve();
                            });
                        })
                    )
                )
                    .then(() => {
                        // Retorne o buffer do arquivo zip
                        resolve(zip.toBuffer());
                    })
                    .catch((err) => reject(err));
            });
        });
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
                        'date',
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

    async findMessagesByChatId(chatId, limit, offset, orderParam = 'desc') {
        let order = orderParam
        if (order !== 'asc' || order !== 'desc') {
            order = 'desc'
        }
        const {count, rows} = await Message.findAndCountAll({
            where: {
                chatId: chatId
            },
            order: [['id', order]],
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
            order: sequelize.literal(
                `(SELECT MAX(message.date) FROM messages AS message WHERE message.chatId = chat.id GROUP BY message.chatId) DESC`
            ),
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

    async findMessagesWithAttachmenty(chatId) {
        return Message.findAll({
            attributes: ['attachmentName', 'id'],
            where: {
                chatId: [chatId],
                attachmentName: {
                    [Sequelize.Op.ne]: null
                }
            }
        })
    }

    async fixMessageAttachmentNotFound() {
        Chat.findAll().then(chats => {
            chats.forEach(chat => {
                this.findMessagesWithAttachmenty(chat.id).then(list => {
                    list.map(({id, attachmentName}) => {
                        const filePath = `${chat.attachmentDir}/${attachmentName}`
                        return {id: id, exists: fs.existsSync(filePath)}
                    }).filter(it => !it.exists)
                        .forEach(it => Message.update({attachmentName: null}, {where: {id: it.id}})
                            .then(() => {
                                console.log('Registros atualizados com sucesso!');
                            }))
                })
            })
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

                        resolve({filePath, dataBuffer})
                    }
                })
            });

        });
    }
}

function formatDate(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = String(date.getFullYear());
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${d}/${MM}/${yyyy} ${hh}:${min}`;
}


module.exports = {
    ChatService: ChatService
}