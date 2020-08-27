const sqlite3 = require("sqlite3");
const dbfile = "./database.db";
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 4040;

const db = new sqlite3.Database(dbfile, err => {
    if(err)
        throw err
    console.log("Connected to database !")
})

app.use(bodyParser.json())


app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`));
