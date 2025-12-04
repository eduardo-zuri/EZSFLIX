const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'EZSFinder API está rodando!',
    status: 'online',
    version: '1.0.0'
  });
});

//rotas
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const ratingsRoutes = require('./routes/ratings');

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/ratings', ratingsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});