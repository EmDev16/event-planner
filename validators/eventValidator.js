import Joi from 'joi';

export const eventSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      'string.base': 'title moet een string zijn',
      'string.empty': 'title mag niet leeg zijn',
      'string.min': 'title moet minstens 3 karakters lang zijn',
      'any.required': 'title is verplicht'
    }),
  start_date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'start_date is verplicht',
      'date.base': 'Formaat: ISO date string (YYYY-MM-DD)',
      'date.format': 'Formaat: ISO date string (YYYY-MM-DD)',
      'date.iso': 'Formaat: ISO date string (YYYY-MM-DD)'
    }),
  end_date: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref('start_date'))
    .messages({
      'any.required': 'end_date is verplicht',
      'date.base': 'Formaat: ISO date string (YYYY-MM-DD)',
      'date.format': 'Formaat: ISO date string (YYYY-MM-DD)',
      'date.iso': 'Formaat: ISO date string (YYYY-MM-DD)',
      'date.greater': 'end_date moet later zijn dan start_date'
    }),
  capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'capacity moet een positief geheel getal zijn',
      'number.integer': 'capacity moet een positief geheel getal zijn',
      'number.min': 'capacity moet een positief geheel getal zijn',
      'any.required': 'capacity is verplicht'
    }),
  location_id: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'location_id moet een geheel getal zijn',
      'number.integer': 'location_id moet een geheel getal zijn'
    })
});
