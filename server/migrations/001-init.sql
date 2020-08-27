-- Up
CREATE TABLE FavoriteProducts (
    id PRIMARY KEY TEXT,
    user INTEGER FOREIGN KEY REFERENCES User(id)
)

CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo varchar(40) NOT NULL,
    password TEXT NOT NULL

)

-- Down
DROP TABLE FavoriteProducts;
DROP TABLE User;