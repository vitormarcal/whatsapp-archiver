"use strict";
const AdmZip = require("adm-zip");
const whatsapp = require("whatsapp-chat-parser");

class ChatImporterService {
    constructor() {
        this.import = dataBuffer => {
            const zip = new AdmZip(dataBuffer);
            const zipEntries = zip.getEntries();

            return this.findMessages(zipEntries)
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
                const parsedMessages = whatsapp.parseString(text, options)
                messages.push(...parsedMessages);
            }
        });
        return messages;
    }
}


module.exports = {
    ChatImporterService
}