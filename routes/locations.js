import express from 'express';
import db from '../db.js';
import Joi from 'joi';

const router = express.Router();

const locationSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  address: Joi.string().trim().min(1).required(),
  city: Joi.string().trim().regex(/^[^\d]+$/).required().messages({
    'string.pattern.base': 'city mag geen cijfers bevatten'
  }),
  max_capacity: Joi.number().integer().min(1).required()
});

function parsePagination(query) {
  const limit = Number(query.limit);
  const offset = Number(query.offset);
  if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
    throw new Error('limit en offset zijn verplicht en moeten integers zijn');
  }
  return { limit, offset };
}

function parseSorting(query) {
  const allowed = ['id', 'name', 'city', 'max_capacity'];
  const sort = allowed.includes(query.sort) ? query.sort : 'id';
  const order = query.order === 'desc' ? 'DESC' : 'ASC';
  return { sort, order };
}

router.get('/', (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const { sort, order } = parseSorting(req.query);

    const rows = db.prepare(`
      SELECT * FROM locations
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    res.json(rows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/search', (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'city query is verplicht' });

  const rows = db.prepare('SELECT * FROM locations WHERE city = ?').all(city);
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM locations WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Locatie niet gevonden' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { error, value } = locationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const result = db.prepare(`
    INSERT INTO locations (name, address, city, max_capacity)
    VALUES (?, ?, ?, ?)
  `).run(value.name, value.address, value.city, value.max_capacity);

  res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { error, value } = locationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const result = db.prepare(`
    UPDATE locations SET name = ?, address = ?, city = ?, max_capacity = ? WHERE id = ?
  `).run(value.name, value.address, value.city, value.max_capacity, req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: 'Locatie niet gevonden' });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM locations WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Locatie niet gevonden' });
  res.json({ success: true });
});

export default router;
