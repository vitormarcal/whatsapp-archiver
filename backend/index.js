'use strict';

require('dotenv').config();
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
const messagesApi = require('./api/message.api')
const parameterApi = require('./api/parameter.api')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common', {stream: fs.createWriteStream(path.join(__dirname, 'app.log'), {flags: 'a'})}));
app.use("/chats", chatsApi)
app.use("/messages", messagesApi)
app.use("/parameters", parameterApi)


module.exports = app


// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3007
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`)
    })
}