const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database.db');

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS empresas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    setor TEXT
)`);

// Endpoint para adicionar uma empresa
app.post('/empresas', (req, res) => {
    const { nome, setor } = req.body;
    db.run(`INSERT INTO empresas (nome, setor) VALUES (?, ?)`, [nome, setor], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Endpoint para obter empresas
app.get('/empresas', (req, res) => {
    db.all(`SELECT * FROM empresas`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
