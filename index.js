'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({filename: path.join(__dirname, 'app.log')}),
    ],
});

const chatsApi = require('./api/chat.api')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common', {stream: fs.createWriteStream(path.join(__dirname, 'app.log'), {flags: 'a'})}));
app.use("/chats", chatsApi)

app.listen(3001, () => {
    logger.info('Server started on port 3001');
});