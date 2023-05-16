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

const auth = require("./middleware/auth")
const chatsApi = require('./api/chat.api')
const messagesApi = require('./api/message.api')
const parameterApi = require('./api/parameter.api')
const usersApi = require('./api/user.api')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common', {stream: fs.createWriteStream(path.join(__dirname, 'app.log'), {flags: 'a'})}));
app.use("/chats", auth, chatsApi)
app.use("/messages", auth, messagesApi)
app.use("/parameters", auth, parameterApi)
app.use("/users", usersApi)


module.exports = app


// Start standalone server if directly running
if (require.main === module) {
    const port = process.env.PORT || 3007
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`API server listening on port ${port}`)
    })
}