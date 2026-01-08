import Joi from 'joi';

export const locationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': 'name moet een string zijn',
      'string.empty': 'name mag niet leeg zijn',
      'any.required': 'name is verplicht'
    }),
  address: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.base': 'address moet een string zijn',
      'string.empty': 'address mag niet leeg zijn',
      'any.required': 'address is verplicht'
    }),
  city: Joi.string()
    .trim()
    .regex(/^\D+$/)
    .required()
    .messages({
      'string.base': 'city moet een string zijn',
      'string.empty': 'city mag niet leeg zijn',
      'string.pattern.base': 'city mag geen cijfers bevatten',
      'any.required': 'city is verplicht'
    }),
  max_capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'max_capacity moet een positief geheel getal zijn',
      'number.integer': 'max_capacity moet een positief geheel getal zijn',
      'number.min': 'max_capacity moet minstens 1 zijn',
      'any.required': 'max_capacity is verplicht'
    })
});
