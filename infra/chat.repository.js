const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./whatsapp_arquiver.sqlite');


class ChatRepository {

    constructor() {
        this.saveChat = (newChat) => {
            const sql =
                `
                    INSERT INTO users(name, email) VALUES (?, ?)
                `
        }
    }

}


module.exports = {
    ChatRepository
}