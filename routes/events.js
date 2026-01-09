import express from 'express';
import { eventSchema } from '../validators/eventValidator.js';
import db from '../db.js';
import e from 'express';

const router = express.Router();

function parsePagination(query) {
    const limit = parseInt(query.limit, 10) || 10;
    const offset = Number(query.offset);

    if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
        throw new Error('limit en offset zijn verplicht en moeten integers zijn');
    }

    return { limit, offset };
}

function parseSorting(query) {
    const sort = allowed.includes(query.sort) ? query.sort : 'id';
    const order = query.order === 'desc' ? 'DESC' : 'ASC';
    return { sort, order };
}

router.get('/', (req, res) => {
    const limit = Number(req.query.limit);
    const offset = Number(req.query.offset);

    if (!Number.isInteger(limit) || !Number.isInteger(offset)) {
        return res.status(400).json({ error: 'limit en offset zijn verplicht en moeten nummers zijn' });
    }

    const allowedSort = ['id', 'title', 'start_date', 'end_date', 'capacity'];
    const sort = allowedSort.includes(req.query.sort)
        ? req.query.sort
        : 'start_date';

    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';

    const rows = db.prepare(`
    SELECT * FROM events
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `).all(limit, offset);

    res.json(rows);
});

router.get('/:id', (req, res) => {
    const event = db
        .prepare('SELECT * FROM events WHERE id = ?')
        .get(req.params.id);

    if (!event) {
        return res.status(404).json({ error: 'Event niet gevonden' });
    }

    res.json(event);
});

router.get('/search/query', (req, res) => {
    const q = `%${req.query.q || ''}%`;

    const events = db.prepare(`
    SELECT * FROM events
    WHERE title LIKE ? OR description LIKE ?
  `).all(q, q);

    res.json(events);
});

router.post('/', (req, res) => {
    // validate
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const startDate = value.start_date instanceof Date
        ? value.start_date.toISOString().slice(0, 10)
        : value.start_date;
    const endDate = value.end_date instanceof Date
        ? value.end_date.toISOString().slice(0, 10)
        : value.end_date;

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(value.location_id);
    if (!location) {
        return res.status(400).json({ error: 'location_id bestaat niet' });
    }
    if (value.capacity > location.max_capacity) {
        return res.status(400).json({ error: 'capacity mag niet groter zijn dan location.max_capacity' });
    }

    const stmt = db.prepare(`
    INSERT INTO events (title, description, start_date, end_date, location_id, capacity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    const result = stmt.run(
        value.title,
        value.description || '',
        startDate,
        endDate,
        value.location_id,
        value.capacity
    );

    res.status(201).json({ id: result.lastInsertRowid });
});

router.put('/:id', (req, res) => {
    const { error, value } = eventSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const startDate = value.start_date instanceof Date
        ? value.start_date.toISOString().slice(0, 10)
        : value.start_date;
    const endDate = value.end_date instanceof Date
        ? value.end_date.toISOString().slice(0, 10)
        : value.end_date;

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(value.location_id);
    if (!location) return res.status(400).json({ error: 'location_id bestaat niet' });
    if (value.capacity > location.max_capacity) return res.status(400).json({ error: 'capacity mag niet groter zijn dan location.max_capacity' });

    const result = db.prepare(`
    UPDATE events
    SET title = ?, description = ?, start_date = ?, end_date = ?, location_id = ?, capacity = ?
    WHERE id = ?
  `).run(
        value.title,
        value.description || '',
        startDate,
        endDate,
        value.location_id,
        value.capacity,
        req.params.id
    );

    if (result.changes === 0) return res.status(404).json({ error: 'Event niet gevonden' });
    res.json({ success: true });
});


router.delete('/:id', (req, res) => {
    const result = db
        .prepare('DELETE FROM events WHERE id = ?')
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Event niet gevonden' });
    }

    res.json({ success: true });
});

router.get('/upcoming/list', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const events = db.prepare(`
    SELECT * FROM events
    WHERE start_date >= ?
    ORDER BY start_date ASC
  `).all(today);

    res.json(events);
});

router.get('/past/list', (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    const events = db.prepare(`
    SELECT * FROM events
    WHERE end_date < ?
    ORDER BY start_date DESC
  `).all(today);

    res.json(events);
});

export default router;
