require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// --- CONFIGURAÇÕES DE AMBIENTE ---
// O Railway define a porta automaticamente. Se não houver, usa 3001.
const PORT = process.env.PORT || 3001;
// Nunca deixe sua chave secreta exposta no código em produção!
const SECRET_KEY = process.env.JWT_SECRET || "chave_temporaria_local";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- CONEXÃO COM BANCO DE DADOS ---
// O Railway fornece uma URL de conexão ou variáveis separadas.
// Esta configuração funciona tanto local quanto no Railway.
const db = mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "",
    database: process.env.MYSQLDATABASE || "arte_foco_db",
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de conexão (Pool não precisa de .connect, mas vamos validar)
db.getConnection((err, connection) => {
    if (err) {
        console.error("Erro ao conectar no MySQL do Railway:", err);
        return;
    }
    console.log("Conectado ao MySQL com sucesso!");
    connection.release();
});

// --- ROTAS ---

// Rota POST /login
app.post("/login", (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: "Email e senha são obrigatórios." });

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ error: "Email ou senha incorretos." });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) return res.status(401).json({ error: "Email ou senha incorretos." });

        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Login bem-sucedido", token, user: { id: user.id, nome: user.nome, email: user.email } });
    });
});

// GET - Listar usuários
app.get("/usuarios", (req, res) => {
    db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST - Criar usuário (Removida a duplicata que existia no seu código)
app.post("/usuarios", async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });

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

// PUT - Editar usuário
app.put("/usuarios/:id", async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body; 

    let query = "UPDATE usuarios SET nome = ?, email = ?";
    let params = [nome, email];

    if (senha) {
        const hashedSenha = await bcrypt.hash(senha, 10);
        query += ", senha = ?";
        params.push(hashedSenha);
    }

    query += " WHERE id = ?";
    params.push(id);

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuário atualizado com sucesso" });
    });
});

// DELETE - Deletar usuário
app.delete("/usuarios/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Usuário deletado" });
    });
});

// Servir arquivos estáticos (ajustado para ser mais genérico)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));