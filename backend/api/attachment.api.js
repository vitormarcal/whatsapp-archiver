const express = require('express');
const router = express.Router();
const { ChatService } = require('../service');
const mimeTypes = require("mime-types");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const chatService = new ChatService();
const upload = multer();


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


router.put('/chat/:chatId/profile-image.jpg', upload.single("image"), (req, res) => {
    const image = req.file;
    chatService.findChat(req.params.chatId).then(chat => {
        const pathImage = path.join(chat.attachmentDir, 'profile_image.jpg');
        fs.writeFile(pathImage, image.buffer, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({error: 'Erro ao salvar imagem.'});
            } else {
                res.status(200).json({message: 'Imagem salva com sucesso.'});
            }
        });
    })
});

router.get("/chat/:chatId/profile-image", (req, res) => {
    let chatId = req.params.chatId;
    chatService.findChat(chatId).then(chat => {

        const filePath = path.join(chat.attachmentDir, 'profile_image.jpg')
        if (chat && fs.existsSync(filePath) ) {
            const image = fs.readFileSync(filePath);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(image);
        } else {
            res.sendStatus(404);
        }

    }).catch(e => {
        console.log(e)
        res.send("error");
    })
});


module.exports = router;