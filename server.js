const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");  // Para JWT

const app = express();

const SECRET_KEY = "ryan123";
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "arte_foco_db"
});

db.connect((err) => {
    if (err) {
        console.log("Erro MySQL:", err);
        return;
    }
    console.log("Conectado ao MySQL.");
});


// Rota POST /login - Autenticar usuário
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Busca usuário pelo email
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ error: "Email ou senha incorretos." });

        const user = results[0];
        // Compara senha hashada
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) return res.status(401).json({ error: "Email ou senha incorretos." });

        // Gera token JWT (expira em 1 hora)
        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login bem-sucedido", token, user: { id: user.id, nome: user.nome, email: user.email } });
    });
});

// GET - Listar usuários (AGORA PROTEGIDA)
app.get("/usuarios", (req, res) => {
    db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST - Criar usuário (AGORA PROTEGIDA)
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }
    
    try {
        const hashedSenha = await bcrypt.hash(senha, 10);
        db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hashedSenha], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Usuário adicionado", id: results.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao processar senha." });
    }
});

// POST - Criar usuário (AGORA PÚBLICO - se)
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
    }
    
    try {
        const hashedSenha = await bcrypt.hash(senha, 10);
        db.query("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [nome, email, hashedSenha], (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Usuário adicionado", id: results.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao processar senha." });
    }
});

// DELETE - Deletar usuário (AGORA PROTEGIDA)
app.delete("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuário deletado" });
    });
});

// Servir arquivos estáticos
app.use(express.static('.'));

// Inicia o servidor
app.listen(3001, () => console.log("Servidor rodando na porta 3001"));