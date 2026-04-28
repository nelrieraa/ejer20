const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Autor = require('../models/autor');
const Libro = require('../models/libro');

function findAutor(id) {
  if (mongoose.isValidObjectId(id)) return Autor.findById(id);
  return Autor.findOne({ referencia: id });
}

// GET /api/autores?nacionalidad=Española
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.nacionalidad) filter.nacionalidad = req.query.nacionalidad;
  const autores = await Autor.find(filter);
  res.json(autores);
});

// GET /api/autores/:id
router.get('/:id', async (req, res) => {
  const autor = await findAutor(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(autor);
});

// GET /api/autores/:id/libros
router.get('/:id/libros', async (req, res) => {
  const autor = await findAutor(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  const libros = await Libro.find({ autor: autor.referencia || autor._id.toString() });
  res.json(libros);
});

// POST /api/autores
router.post('/', async (req, res) => {
  const autor = new Autor(req.body);
  await autor.save();
  res.status(201).json(autor);
});

// PUT /api/autores/:id
router.put('/:id', async (req, res) => {
  let autor;
  if (mongoose.isValidObjectId(req.params.id)) {
    autor = await Autor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  } else {
    autor = await Autor.findOneAndUpdate({ referencia: req.params.id }, req.body, { new: true, runValidators: true });
  }
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(autor);
});

// DELETE /api/autores/:id
router.delete('/:id', async (req, res) => {
  let autor;
  if (mongoose.isValidObjectId(req.params.id)) {
    autor = await Autor.findByIdAndDelete(req.params.id);
  } else {
    autor = await Autor.findOneAndDelete({ referencia: req.params.id });
  }
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json({ message: 'Autor eliminado correctamente' });
});

module.exports = router;
