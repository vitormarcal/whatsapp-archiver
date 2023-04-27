const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('banco_de_dados.sqlite');

function createTables() {
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, message TEXT)', (err) => {
            if (err) {
                return console.log(err.message);
            }
            console.log(`Table created`);
        });

        const stmt = db.prepare("INSERT INTO messages VALUES (? ,?, ?)");
        for (let i = 0; i < 10; i++) {
            stmt.run(i, "Ipsum " + i, "Ipsum " + 1);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, author, message  FROM messages", (err, row) => {
            console.log(row);
        });
    });

    db.close();
}

createTables();

function initDB() {
    createTables()
}

module.exports = {
    initDB
}
