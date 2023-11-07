const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const url = require('url');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});
let sql;

app.use(bodyParser.json());

app.post('/quote', (req, res, next) => {
    try {
        const {movie, quote, character} = req.body;
        sql = "INSERT INTO quote (movie, quote, character) VALUES (?, ?, ?)";
        db.run(sql, [movie, quote, character], (err) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err
                })
            }
            console.log("Succesful post", movie, quote, character);

        });
        res.json({
            status: 200,
            success: true
        })
    } catch(error){
        return res.json({
            status: 400,
            success: false
        })
    }
});

app.get('/quote', (req, res) => {
    const sql = "SELECT * FROM quote";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error in SQL query:", err);
            return res.status(500).json({ status: 500, success: false, error: "Internal server error" });
        }
        if (rows.length < 1) {
            return res.status(404).json({ status: 404, success: false, error: "No matching data found" });
        }
        return res.json({ status: 200, data: rows, success: true });
    });
});

app.listen(3000, ()=>{
    console.log('Listening at port 3000');
})