import express from 'express';
import { eventSchema } from '../validators/eventValidator.js';
import db from '../db.js'; // toegevoegd
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
    try {
        const { limit, offset } = parsePagination(req.query);
        const { sort, order } = parseSorting(req.query,
            ['id', 'title', 'start_date'
            ]);

        const events = db.prepare(`
        SELECT * FROM events ORDER BY ${sort} ${order} 
        LIMIT ? OFFSET ?`).all(limit, offset);

        res.json(events);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
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

export default router;
