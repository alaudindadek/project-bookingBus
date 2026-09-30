const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbSql'
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend! with mongoDB' });
});

app.post('/api/users', async (req, res) => {
    try {
        const { username, email, password} = req.body;
        const [resultAdd] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [resultAdd.insertId]);
        res.status(201).json(rows[0]);
    } catch (error){
        // client error (400)
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json(rows); 
    } catch (error){
        // server error (500)
        res.status(500).json({ error: error.message });
    }
})

app.delete('/api/users/:id', async (req, res) => {
    try {
        // object store paremeter value in a URL such as { id: "123" }
        const { id } = req.params;
        const [resultDelete] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'User deleted', user: resultDelete });
    }catch (error){
        res.status(500).json({ error: error.message });
    }
} )

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});