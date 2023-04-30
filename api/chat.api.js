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
    let id = req.params.id;
    chatService.findChat(id).then(chat => {
        if (chat) res.send(chat)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar chat ${id}`, error);
        res.sendStatus(500);
    });
});

module.exports = router;