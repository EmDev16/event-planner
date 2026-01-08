import express from 'express';
import { eventSchema } from '../validators/eventValidator.js';

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

  return res.status(201).json({ success: true, data: value });
});

export default router;
