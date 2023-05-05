const express = require('express');
const router = express.Router();
const {ChatService} = require('../service');
const chatService = new ChatService();

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

module.exports = router;