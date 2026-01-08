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
    })
});
