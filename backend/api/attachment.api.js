const express = require('express');
const router = express.Router();
const { ChatService } = require('../service');
const mimeTypes = require("mime-types");
const chatService = new ChatService();


router.get("/message/:messageId", (req, res) => {
    chatService.findAttachmentBy(req.params.messageId).then(({filePath, dataBuffer}) => {
        if (dataBuffer) {
            const mimeType = mimeTypes.lookup(filePath);
            if (mimeType) {
                res.set("Content-Type", mimeType);
                res.send(dataBuffer);
            } else {
                res.sendStatus(415);
            }
        }
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar anexo messageId: ${req.params.messageId}`, error);
        res.sendStatus(500);
    });
});


module.exports = router;