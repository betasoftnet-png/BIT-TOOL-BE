const Joi = require('joi');

const createContactSchema = Joi.object({
  name: Joi.string().required(),
  phonenumber: Joi.string().allow('', null).optional(),
  email: Joi.string().email().allow('', null).optional(),
  role: Joi.string().allow('', null).optional()
});

const updateContactSchema = Joi.object({
  name: Joi.string().optional(),
  phonenumber: Joi.string().allow('', null).optional(),
  email: Joi.string().email().allow('', null).optional(),
  role: Joi.string().allow('', null).optional()
});

// Middleware factory for Joi validation
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: messages
      });
    }
    next();
  };
};

module.exports = {
  createContactSchema,
  updateContactSchema,
  validate
};
