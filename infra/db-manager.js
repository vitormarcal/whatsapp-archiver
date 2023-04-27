const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./whatsapp_arquiver.sqlite');
const fs = require('fs');
const path = require("path");
function createTables() {
    const creaateTableFile = path.join(__dirname, './migrations/create_table.sql')
    fs.readFile(creaateTableFile, 'utf8', (err, sql) => {
        if (err) {
            throw err;
        }
        db.serialize(() => {
            db.run(sql, (err) => {
                if (err) {
                    throw err;
                }
                console.log('Tabelas criadas com sucesso!');
            });
        });
    });
}

createTables();

function initDB() {
    createTables()
}

module.exports = {
    initDB
}
