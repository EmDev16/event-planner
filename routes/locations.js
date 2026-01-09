import express from 'express';
import db from '../db.js';
import { locationSchema } from '../validators/locationValidator.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { error, value } = locationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details || [];
    let message = details[0]?.message || 'Ongeldige invoer';

    // Specifieke mapping voor city-regels
    if (details.some(d => d.type === 'string.pattern.base' && d.context?.key === 'city')) {
      message = 'city mag geen cijfers bevatten';
    } else if (details.some(d => d.type === 'string.base' && d.context?.key === 'city')) {
      message = 'city moet een string zijn';
    } else if (details.some(d => d.type === 'any.required')) {
      // beknopte melding wanneer verplichte velden ontbreken
      message = 'Verplichte velden ontbreken';
    }

    return res.status(400).json({ error: message });
  }

  const stmt = db.prepare('INSERT INTO locations (name, address, city, max_capacity) VALUES (?, ?, ?, ?)');
  const info = stmt.run(value.name, value.address, value.city, value.max_capacity);

  const created = {
    id: info.lastInsertRowid,
    name: value.name,
    address: value.address,
    city: value.city,
    max_capacity: value.max_capacity
  };

  return res.status(201).json({ success: true, data: created });
});

router.get('/search', (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'city is verplicht' });
  }

  const locations = db.prepare(`
    SELECT * FROM locations WHERE city = ?
  `).all(city);

  res.json(locations);
});


export default router;
