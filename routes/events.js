import express from 'express';
import { eventSchema } from '../validators/eventValidator.js';
import db from '../db.js'; // toegevoegd

const router = express.Router();

router.post('/', (req, res) => {
  const { error, value } = eventSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const details = error.details || [];
    let message = details[0]?.message || 'Ongeldige invoer';

    // Als één (of beide) required-fouten aanwezig zijn voor start_date of end_date => generieke boodschap
    const hasMissingStartOrEnd = details.some(d =>
      d.type === 'any.required' && (d.context?.key === 'start_date' || d.context?.key === 'end_date')
    );
    if (hasMissingStartOrEnd) {
      message = 'Beide velden moeten aanwezig zijn';
    } else if (details.some(d => d.type === 'date.greater')) {
      message = 'end_date moet later zijn dan start_date';
    } else if (details.some(d => d.type && d.type.startsWith('date'))) {
      message = 'Formaat: ISO date string (YYYY-MM-DD)';
    }

    return res.status(400).json({ error: message });
  }

  // Controleer capacity tegen locatiecapaciteit indien location_id opgegeven
  if (value.location_id != null) {
    const stmt = db.prepare('SELECT max_capacity FROM locations WHERE id = ?');
    const row = stmt.get(value.location_id);

    if (!row) {
      return res.status(400).json({ error: 'Locatie niet gevonden' });
    }

    const maxCap = row.max_capacity;
    if (value.capacity > maxCap) {
      return res.status(400).json({ error: 'Kan niet groter zijn dan de locatiecapaciteit' });
    }
  }

  return res.status(201).json({ success: true, data: value });
});

export default router;
