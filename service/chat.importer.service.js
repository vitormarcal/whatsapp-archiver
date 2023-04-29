"use strict";
const AdmZip = require("adm-zip");
const whatsapp = require("whatsapp-chat-parser");
const dbManager = require('../infra/db-manager')
const ChatRepository = require('../infra/chat.repository').ChatRepository
const chatRepository = new ChatRepository()


class ChatImporterService {
    constructor() {
        this.import = dataBuffer => {
            const zip = new AdmZip(dataBuffer);
            const zipEntries = zip.getEntries();

            const messages = this.findMessages(zipEntries);

            const authors = [...new Set(messages.map(message => message.author))]
                .filter(author => author !== null)
            authors.sort();
            const chatKey = authors.join('#');

            const newChat = {
                messages,
                chatKey
            }

            chatRepository.saveChat(newChat)

        }
    }

    findMessages(zipEntries) {
        const messages = [];
        zipEntries.forEach(zipEntry => {
            if (zipEntry.entryName.endsWith('.txt')) {
                console.log(`Conteúdo do arquivo de texto ${zipEntry.entryName}:`);
                const text = zipEntry.getData().toString('utf8')
                const options = {
                    parseAttachments: true
                }
                const parsedMessages =  whatsapp.parseString(text, options)
                messages.push(...parsedMessages);
            }
        });
        return messages;
    }
}


module.exports = {
    ChatImporterService
}