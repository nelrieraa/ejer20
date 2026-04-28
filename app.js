require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().catch(err => console.error('Error MongoDB:', err));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/autores', require('./routes/autores'));
app.use('/api/libros',  require('./routes/libros'));

app.get('/', (req, res) => {
  res.json({
    message: 'API Biblioteca funcionando',
    endpoints: {
      autores: '/api/autores',
      libros:  '/api/libros',
    },
  });
});

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`📚 API corriendo en http://localhost:${PORT}`));
}

module.exports = app;
