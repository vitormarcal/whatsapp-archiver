const fs = require('fs');
const express = require('express');
const path = require("path");
const router = express.Router();
const {ChatImporterService, ChatService} = require('../service/index');
const chatImportService = new ChatImporterService();
const chatService = new ChatService();

router.get("/", function (req, res) {
    res.send(["all chats"]);
});

router.get("/force-import", function (req, res) {
    const chatDir = path.join(__dirname, '../example')
    const filePath = chatDir + '/chat.zip'
    const dataBuffer = fs.readFileSync(filePath);
    const messages = chatImportService.import(dataBuffer)
    chatService.saveAll(messages, chatDir).then(saved => {
        console.log(saved)
        res.send(saved);
    }).catch(e => {
        console.log(e)
        res.send("error");
    })
});

router.get("/:id", function (req, res) {
    const id = req.params.id

    res.send({id});
});

module.exports = router;