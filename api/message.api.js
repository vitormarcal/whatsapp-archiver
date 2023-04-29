const fs = require('fs');
const express = require('express');
const path = require("path");
const router = express.Router();
const ChatImporterService = require('../service/chat.importer.service').ChatImporterService;
const chatImportService = new ChatImporterService();

router.get("/", function (req, res) {
    res.send("messages");
});

router.get("/force-import", function (req, res) {
    const filePath = path.join(__dirname, '../example/chat.zip')
    const dataBuffer = fs.readFileSync(filePath);
    chatImportService.import(dataBuffer)
    res.send("imported");
});

module.exports = router;