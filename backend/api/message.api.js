const express = require('express');
const router = express.Router();
const {ChatService, MessageService} = require('../service');
const chatService = new ChatService();
const messageService = new MessageService();

router.get("/:messageId/attachment", function (req, res) {
    let messageId = req.params.messageId;
    chatService.findAttachmentBy(messageId).then(file => {
        if (file) res.send(file)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar anexo messageId: ${messageId}`, error);
        res.sendStatus(500);
    });
});

router.patch("/author", function (req, res) {
    let { oldName, newName, chatId } = req.body;

    messageService.updateAuthorName(chatId, oldName, newName).then(() => {
       res.sendStatus(200)
    }).catch(error => {
        console.error(`Erro ao buscar mensagens ${chatId}`, error);
        res.sendStatus(500);
    });
});

module.exports = router;