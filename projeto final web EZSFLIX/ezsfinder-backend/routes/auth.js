const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

//registro
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    //verificar se usuario existe
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    //hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    //inserir usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );

    //gerar token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: { id: result.insertId, nome, email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // buscar usuario
    const [users] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = users[0];

    //checar senha
    const senhaValida = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    //token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;