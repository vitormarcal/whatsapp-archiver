CREATE TABLE IF NOT EXISTS chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS attachment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    path TEXT NOT NULL,
);

CREATE TABLE IF NOT EXISTS message_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NULL,
    message_content TEXT NOT NULL,
    chat_id INTEGER NOT NULL,
    attachment_id INTEGER NULL,
    date TEXT NOT NULL,

    CONSTRAINT FOREIGN KEY (chat_id) REFERENCES chat (id)
    CONSTRAINT FOREIGN KEY (attachment_id) REFERENCES attachment (id)
);

