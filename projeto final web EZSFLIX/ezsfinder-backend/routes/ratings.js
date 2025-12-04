const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

//obter avaliacoes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [ratings] = await db.query(
      'SELECT * FROM avaliacoes WHERE usuario_id = ?',
      [req.userId]
    );
    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
});

//adicionar/atualizar avaliacao
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo_id, tipo, nota } = req.body;

    await db.query(
      'INSERT INTO avaliacoes (usuario_id, titulo_id, tipo, nota) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nota = ?',
      [req.userId, titulo_id, tipo, nota, nota]
    );

    res.status(201).json({ message: 'Avaliação salva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao salvar avaliação' });
  }
});

module.exports = router;