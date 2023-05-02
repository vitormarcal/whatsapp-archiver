"use strict";
const AdmZip = require("adm-zip");
const whatsapp = require("whatsapp-chat-parser");
const fs = require("fs");
const path = require("path");
const srcDir = path.join(__dirname, '../whatsapp/srcDir')
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
        const zipEntriesFiles = []
        zipEntries.forEach(zipEntry => {
            if (zipEntry.entryName.endsWith('.txt')) {
                console.log(`Conteúdo do arquivo de texto ${zipEntry.entryName}:`);
                const text = zipEntry.getData().toString('utf8')
                const options = {
                    parseAttachments: true
                }
                const parsedMessages = whatsapp.parseString(text, options)
                messages.push(...parsedMessages);
            } else {
                zipEntriesFiles.push(zipEntry)
            }
        });
        return {
            messages,
            zipEntriesFiles
        }
    }

    performArchivingFiles(chat, zipEntriesFiles) {
        const chatDir = chat.attachmentDir;

        if (!fs.existsSync(chatDir)) {
            fs.mkdirSync(chatDir, {recursive: true});
        }

        zipEntriesFiles.forEach(file => {

            let fileName = file.name;
            let buffer = file.getData();

            fs.writeFileSync(`${chatDir}/${fileName}`, buffer);

            console.log('Buffer copiado com sucesso para o arquivo!');
        })

    }

    async doImport(sourceDir) {
        const finalSrcDir = sourceDir || srcDir

        this.organize(finalSrcDir);
        const files = fs.readdirSync(finalSrcDir)

        const filesPath = files.filter(it => it.includes(".zip")).map(it => `${finalSrcDir}/${it}`)

        const saveAllPromises = filesPath.map(filePath => {
            const dataBuffer = fs.readFileSync(filePath);
            const {messages, zipEntriesFiles} = this.parseMessages(dataBuffer)

            return {zipEntriesFiles, messages: messages, filePath}
        }).map(({messages, zipEntriesFiles, filePath}) => {
            return chatService.saveAll(messages, archiveDir).then(chat => {
                this.performArchivingFiles(chat, zipEntriesFiles)
                return chat
            })
        })

        return Promise.all(saveAllPromises)
            .then((chats) => {
                console.log('Todos os arquivos foram salvos com sucesso!');
                return chats
            })
            .catch((err) => {
                console.log('Erro ao salvar arquivos:', err);
                throw err
            });

    }

    organize(sourceDir) {

        const files = fs.readdirSync(sourceDir)
        if (files.find(it => it.includes('.txt'))) {
            this.zipAll(sourceDir)
        }

        try {
            fs.readdirSync(sourceDir).map(it =>  `${sourceDir}/${it}`).forEach(filePath => {
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    this.organize(filePath)
                }
            })

        } catch (err) {
            console.error(err);
        }
    }

    zipAll(srcDir) {
        const zip = new AdmZip();
        const zipFilePath = `${srcDir}/zipped.zip`
        const filesToRemove = []
        fs.readdirSync(srcDir).forEach(file => {
            const filePath = path.join(srcDir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                filesToRemove.push(filePath)
                zip.addLocalFile(filePath);
            }
        });

        zip.writeZip(zipFilePath);

        fs.readdirSync(srcDir).forEach(file => {
            const filePath = path.join(srcDir, file);
            if (filesToRemove.find(it => it === filePath)) {
                fs.unlinkSync(filePath);
                console.log('Arquivo removido:', filePath);
            }
        });
    }
}


module.exports = {
    ChatImporterService
}