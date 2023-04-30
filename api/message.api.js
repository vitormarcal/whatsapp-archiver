const fs = require('fs');
const express = require('express');
const path = require("path");
const router = express.Router();
const { ChatImporterService, MessageService } = require('../service/index');
const chatImportService = new ChatImporterService();
const messageService = new MessageService();

router.get("/", function (req, res) {
    res.send("messages");
});

router.get("/force-import", function (req, res) {
    const chatDir = path.join(__dirname, '../example')
    const filePath = chatDir + '/chat.zip'
    const dataBuffer = fs.readFileSync(filePath);
    const messages = chatImportService.import(dataBuffer)
    messageService.save(messages, chatDir).then(r => {
        console.log(r)
        res.send("imported");
    }).catch(e => {
        console.log(r)
        res.send("error");
    })
});

module.exports = router;