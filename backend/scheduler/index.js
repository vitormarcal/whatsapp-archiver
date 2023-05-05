const cron = require('node-cron');


const fs = require('fs');
const {ChatImporterService} = require('../service/index');
const chatImportService = new ChatImporterService();

cron.schedule('0 */5 * * *', chatImportService.doImport);


