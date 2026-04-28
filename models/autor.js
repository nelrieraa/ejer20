const mongoose = require('mongoose');

const autorSchema = new mongoose.Schema({
  referencia:      { type: String, unique: true, sparse: true },
  nombre:          { type: String, required: true },
  nacionalidad:    String,
  fechaNacimiento: Date,
  imagenUrl:       String,
}, { versionKey: false });

module.exports = mongoose.model('Autor', autorSchema, 'autores');
