const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

//obter favoritos
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [favorites] = await db.query(
      'SELECT * FROM favoritos WHERE usuario_id = ?',
      [req.userId]
    );
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar favoritos' });
  }
});

//adicionar favorito
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo_id, tipo, titulo, poster_path, vote_average } = req.body;

    await db.query(
      'INSERT INTO favoritos (usuario_id, titulo_id, tipo, titulo, poster_path, vote_average) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, titulo_id, tipo, titulo, poster_path, vote_average]
    );

    res.status(201).json({ message: 'Favorito adicionado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar favorito' });
  }
});

//remover favorito
router.delete('/:titulo_id/:tipo', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM favoritos WHERE usuario_id = ? AND titulo_id = ? AND tipo = ?',
      [req.userId, req.params.titulo_id, req.params.tipo]
    );
    res.json({ message: 'Favorito removido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover favorito' });
  }
});

module.exports = router;