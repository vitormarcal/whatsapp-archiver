'use strict';

const fs = require('fs');
const AdmZip = require('adm-zip');
const whatsapp = require('whatsapp-chat-parser');
const path = require('path');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const dbManager = require('./infra/db-manager')

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: path.join(__dirname, 'app.log')}),
    ],
});

const messagesApi = require('./api/message.api')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common', {stream: fs.createWriteStream(path.join(__dirname, 'app.log'), {flags: 'a'})}));
app.use("/messages", messagesApi)


function init() {
    dbManager.initDB()
}

init()

app.listen(3001, () => {
    logger.info('Server started on port 3001');
});