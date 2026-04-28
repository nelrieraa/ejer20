const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Libro = require('../models/libro');

function findLibro(id) {
  if (mongoose.isValidObjectId(id)) return Libro.findById(id);
  return Libro.findOne({ referencia: id });
}

// GET /api/libros?sort=titulo
router.get('/', async (req, res) => {
  const query = Libro.find();
  if (req.query.sort) query.sort({ [req.query.sort]: 1 });
  const libros = await query;
  res.json(libros);
});

// GET /api/libros/:id
router.get('/:id', async (req, res) => {
  const libro = await findLibro(req.params.id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
});

// POST /api/libros
router.post('/', async (req, res) => {
  const libro = new Libro(req.body);
  await libro.save();
  res.status(201).json(libro);
});

// PUT /api/libros/:id
router.put('/:id', async (req, res) => {
  let libro;
  if (mongoose.isValidObjectId(req.params.id)) {
    libro = await Libro.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  } else {
    libro = await Libro.findOneAndUpdate({ referencia: req.params.id }, req.body, { new: true, runValidators: true });
  }
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
});

// DELETE /api/libros/:id
router.delete('/:id', async (req, res) => {
  let libro;
  if (mongoose.isValidObjectId(req.params.id)) {
    libro = await Libro.findByIdAndDelete(req.params.id);
  } else {
    libro = await Libro.findOneAndDelete({ referencia: req.params.id });
  }
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json({ message: 'Libro eliminado correctamente' });
});

module.exports = router;
