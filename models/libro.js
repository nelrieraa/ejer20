const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  referencia:      { type: String, unique: true, sparse: true },
  titulo:          { type: String, required: true },
  genero:          String,
  anyoPublicacion: Number,
  autor:           { type: String, required: true },
  imagenUrl:       String,
}, { versionKey: false });

module.exports = mongoose.model('Libro', libroSchema, 'libros');
