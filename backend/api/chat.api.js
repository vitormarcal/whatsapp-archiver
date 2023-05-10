const fs = require('fs');
const express = require('express');
const path = require("path");
const router = express.Router();
const {ChatImporterService, ChatService} = require('../service');
const chatImportService = new ChatImporterService();
const chatService = new ChatService();

router.get("/", function (req, res) {
    chatService.findAll().then(chats => {
        res.send(chats);
    }).catch(e => {
        console.log(e)
        res.send("error");
    })
});

router.get("/force-import", function (req, res) {
    chatImportService.doImport().then(saved => {
        console.log(saved)
        res.send(saved);
    }).catch(e => {
        console.log(e)
        res.send("error");
    })
});

router.get("/:chatId", function (req, res) {
    let chatId = req.params.chatId;
    chatService.findChat(chatId).then(chat => {
        if (chat) res.send(chat)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar chat ${chatId}`, error);
        res.sendStatus(500);
    });
});

router.patch("/:chatId/name", function (req, res) {
    let chatId = req.params.chatId;
    let newChatName = req.body.newChatName;
    chatService.updateNameById(chatId, newChatName).then(() => {
        res.sendStatus(200)
    }).catch(error => {
        console.error(`Erro ao buscar chat ${chatId}`, error);
        res.sendStatus(500);
    });
});

router.get("/:chatId/messages", function (req, res) {
    let chatId = req.params.chatId;
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)

    if (isNaN(limit) || isNaN(offset)) res.status(400).send("O parâmetro skip e offset precisa ser um número");

    chatService.findMessagesByChatId(chatId, limit, offset).then(messages => {
        if (messages) res.send(messages)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar mensagens ${chatId}`, error);
        res.sendStatus(500);
    });
});


module.exports = router;