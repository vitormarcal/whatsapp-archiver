'use strict';

const fs = require('fs');
const AdmZip = require('adm-zip');
const whatsapp = require('whatsapp-chat-parser');
const path = require('path');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
require('./infra/db-manager').initDB()

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: path.join(__dirname, 'app.log')}),
    ],
});

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common', {stream: fs.createWriteStream(path.join(__dirname, 'app.log'), {flags: 'a'})}));


app.listen(3001, () => {
    logger.info('Server started on port 3001');
});

function extractZipBackup(path) {
    const data = fs.readFileSync(path);
    const zip = new AdmZip(data);
    const zipEntries = zip.getEntries();
    zipEntries.forEach(function (zipEntry) {
        if (zipEntry.entryName.endsWith('.txt')) {
            console.log(`Conteúdo do arquivo de texto ${zipEntry.entryName}:`);
            const text = zipEntry.getData().toString('utf8')
            const options = {
                parseAttachments: true
            }
            const messages = whatsapp.parseString(text, options);
            console.log(messages);
        }
    });
}

extractZipBackup('./example/chat.zip');