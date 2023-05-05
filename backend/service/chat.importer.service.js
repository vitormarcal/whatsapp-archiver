"use strict";
const AdmZip = require("adm-zip");
const crypto = require('crypto');
const whatsapp = require("whatsapp-chat-parser");
const fs = require("fs");
const path = require("path");
const srcDir = path.join(__dirname, '../whatsapp/srcDir')
const archiveDir = path.join(__dirname, '../whatsapp/archiveDir')
const ChatService = require('../service/chat.service').ChatService;
const chatService = new ChatService();
const util = require('util');
const CHAT_NAME_PROPERTIES = 'chat_name.properties'

class ChatImporterService {
    constructor() {
        this.parseMessages = dataBuffer => {
            const zip = new AdmZip(dataBuffer);
            const zipEntries = zip.getEntries();

            return this.findMessages(zipEntries)
        }

        this.organizeAll = (sourceDir) => this.organize(sourceDir || srcDir)
    }

    findMessages(zipEntries) {
        const messages = [];
        const zipEntriesFiles = []
        let chatName = undefined
        zipEntries.forEach(zipEntry => {
            if (zipEntry.entryName === CHAT_NAME_PROPERTIES) {
                chatName = zipEntry.getData().toString()
            }
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
            zipEntriesFiles,
            chatName
        }
    }

    performArchivingFiles(chat, zipEntriesFiles, zipFilePath) {
        const chatDir = chat.attachmentDir;

        if (!fs.existsSync(chatDir)) {
            fs.mkdirSync(chatDir, {recursive: true});
        }

        const promises = zipEntriesFiles.map(file => {

            let fileName = file.name;
            let buffer = file.getData();

            return new Promise((resolve, reject) => {
                fs.writeFile(`${chatDir}/${fileName}`, buffer, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`Buffer ${fileName} copiado com sucesso para o diretório arquivo!`);
                        resolve();
                    }
                });
            })
        })

        return Promise.all(promises).then(() => {
            console.log('Todos os arquivos foram copiados com sucesso!');
            fs.unlinkSync(zipFilePath)
        }).catch((err) => {
            console.error('Erro ao copiar arquivos: ', err);
        })

    }

    async doImport(sourceDir) {
        const finalSrcDir = sourceDir || srcDir

        this.organizeAll(finalSrcDir);
        const files = fs.readdirSync(finalSrcDir)

        const filesPath = files.filter(it => it.includes(".zip")).map(it => `${finalSrcDir}/${it}`)

        const saveAllPromises = filesPath.map(filePath =>
            this.readFileAndParseMessages(filePath)
                .then(({messages, zipEntriesFiles, chatName}) => {
                    return chatService.saveAll(messages, archiveDir, chatName)
                        .then(chat => {
                            this.performArchivingFiles(chat, zipEntriesFiles, filePath)
                            return chat
                        })
                }))

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

    readFileAndParseMessages(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, dataBuffer) => {
                if (err) {
                    reject(err);
                } else {
                    const {messages, zipEntriesFiles, chatName} = this.parseMessages(dataBuffer)
                    resolve({zipEntriesFiles, messages: messages, chatName})
                }
            })
        });
    }

    organize(sourceDir) {

        const isRootDir = sourceDir === srcDir

        const saveAndGetDirName = (sourceDir, isRootDir) => {
            if (!isRootDir) {
                const chatNamePath = `${sourceDir}/${CHAT_NAME_PROPERTIES}`
                if (fs.existsSync(chatNamePath)) {
                    return fs.readFileSync(chatNamePath);
                } else {
                    const dirName = path.basename(sourceDir)
                    fs.writeFileSync(`${sourceDir}/${CHAT_NAME_PROPERTIES}`, dirName)
                    return dirName
                }


            }
        }


        let dirName = saveAndGetDirName(sourceDir, isRootDir);

        const files = fs.readdirSync(sourceDir)
        if (files.find(it => it.includes('.txt'))) {
            this.zipAll(sourceDir, dirName)
        } else {
            const zipToMove = files.find(it => it.includes('.zip'))
            if (zipToMove) {
                fs.renameSync(path.join(sourceDir, zipToMove), path.join(srcDir, zipToMove))
            }

        }


        try {
            fs.readdirSync(sourceDir).map(it => `${sourceDir}/${it}`).forEach(filePath => {
                const stats = fs.statSync(filePath);
                if (stats.isDirectory()) {
                    this.organize(filePath)
                }
            })

        } catch (err) {
            console.error(err);
        }
    }

    zipAll(sourceDir, dirName) {
        const zip = new AdmZip();
        const zipName = dirName || crypto.randomBytes(20).toString('hex');
        const zipFilePath = `${srcDir}/${zipName}.zip`
        const filesToRemove = []
        fs.readdirSync(sourceDir).forEach(file => {
            const filePath = path.join(sourceDir, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                filesToRemove.push(filePath)
                zip.addLocalFile(filePath);
            }
        });

        zip.writeZip(zipFilePath);

        fs.readdirSync(sourceDir).forEach(file => {
            const filePath = path.join(sourceDir, file);
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