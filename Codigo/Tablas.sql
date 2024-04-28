PRAGMA foreign_keys = ON;

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name TEXT,
    lastname TEXT
);

CREATE TABLE persons_images(
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    photo BLOB,
    FOREIGN KEY (userId) REFERENCES user(id)
);