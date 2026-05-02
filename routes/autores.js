const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Autor = require('../models/autor');
const Libro = require('../models/libro');

function findAutor(id) {
  if (mongoose.isValidObjectId(id)) return Autor.findById(id);
  return Autor.findOne({ referencia: id });
}

router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.nacionalidad) filter.nacionalidad = req.query.nacionalidad;
  const autores = await Autor.find(filter);
  res.json(autores);
});

router.get('/:id', async (req, res) => {
  const autor = await findAutor(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(autor);
});

router.get('/:id/libros', async (req, res) => {
  const autor = await findAutor(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  const libros = await Libro.find({ autor: autor.referencia || autor._id.toString() });
  res.json(libros);
});

router.post('/', async (req, res) => {
  const autor = new Autor(req.body);
  await autor.save();
  res.status(201).json(autor);
});

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
