"use strict";
const AdmZip = require("adm-zip");
const whatsapp = require("whatsapp-chat-parser");
const fs = require("fs");
const path = require("path");
const srdDir = path.join(__dirname, '../whatsapp/srcDir')
const archiveDir = path.join(__dirname, '../whatsapp/archiveDir')
const ChatService = require('../service/chat.service').ChatService;
const chatService = new ChatService();
const util = require('util');
class ChatImporterService {
    constructor() {
        this.parseMessages = dataBuffer => {
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

    async doImport() {
        const previousFiles = fs.readdirSync(srdDir)
        await util.promisify(setTimeout)(1000); // espera por 1 segundos
        const files = fs.readdirSync(srdDir)

        if (files.length !== previousFiles.length || !files.every((file, index) => file === previousFiles[index])) {
            // Alguma alteração foi detectada
            console.log('Arquivos alterados:', files);
            throw new Error("Esse diretório está em escrita, tente novamente.")
        } else {
            const filesPath = files.filter(it => it.includes(".zip")).map(it => `${srdDir}/${it}`)

            const saveAllPromises = filesPath.map(filePath => {
                const dataBuffer = fs.readFileSync(filePath);
                return  {filePath, messages: this.parseMessages(dataBuffer)}
            }).map(it => {
                return chatService.saveAll(it.messages, archiveDir)
            })

            return Promise.all(saveAllPromises)
                .then((messages) => {
                    console.log('Todos os arquivos foram salvos com sucesso!');
                    return messages
                })
                .catch((err) => {
                    console.log('Erro ao salvar arquivos:', err);
                    throw err
                });

        }

    }
}


module.exports = {
    ChatImporterService
}