const fs = require('fs');
const multer = require("multer");
const upload = multer();
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

router.get("/fix-attachments-not-found", function (req, res) {
    chatService.fixMessageAttachmentNotFound().then(saved => {
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

router.get("/:chatId/export", function (req, res) {
    let chatId = req.params.chatId;
    chatService.export(chatId).then(saved => {
        res.send(saved);
    }).catch(e => {
        console.log(e)
        res.send("error");
    })
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
    const order = req.query.order || "desc"
    const limit = parseInt(req.query.limit || 1000)
    const offset = parseInt(req.query.offset || 0)

    if (isNaN(limit) || isNaN(offset)) res.status(400).send("O parâmetro skip e offset precisa ser um número");

    chatService.findMessagesByChatId(chatId, limit, offset, order).then(messages => {
        if (messages) res.send(messages)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar mensagens ${chatId}`, error);
        res.sendStatus(500);
    });
});

router.put('/:chatId/profile-image.jpg', upload.single("image"), (req, res) => {
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

router.get("/:chatId/profile-image.jpg", function (req, res) {
    let chatId = req.params.chatId;
    chatService.findChat(chatId).then(chat => {

        if (chat && fs.existsSync(chat.attachmentDir)) {
            const image = fs.readFileSync(path.join(chat.attachmentDir, 'profile_image.jpg'));
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


router.get("/:chatId/messages/attachments/", function (req, res) {
    let chatId = req.params.chatId;

    chatService.findMessagesWithAttachmenty(chatId).then(names => {
        if (names) res.send(names)
        else res.sendStatus(404)
    }).catch(error => {
        console.error(`Erro ao buscar mensagens ${chatId}`, error);
        res.sendStatus(500);
    });
});


module.exports = router;