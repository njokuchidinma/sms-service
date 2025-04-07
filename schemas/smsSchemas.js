// schemas/smsSchemas.js
import Joi from 'joi';

const smsSchema = Joi.object({
  from: Joi.string().min(6).max(16).required().messages({
    'string.base': 'from is invalid',
    'string.empty': 'from is missing',
    'string.min': 'from is invalid',
    'string.max': 'from is invalid',
    'any.required': 'from is missing',
  }),
  to: Joi.string().min(6).max(16).required().messages({
    'string.base': 'to is invalid',
    'string.empty': 'to is missing',
    'string.min': 'to is invalid',
    'string.max': 'to is invalid',
    'any.required': 'to is missing',
  }),
  text: Joi.string().min(1).max(120).required().messages({
    'string.base': 'text is invalid',
    'string.empty': 'text is missing',
    'string.min': 'text is invalid',
    'string.max': 'text is invalid',
    'any.required': 'text is missing',
  }),
});

export const inboundSmsSchema = smsSchema;
export const outboundSmsSchema = smsSchema;
