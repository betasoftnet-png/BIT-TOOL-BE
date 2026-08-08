const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().allow('', null).optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  color: Joi.string().allow('', null).optional()
});

const createEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  location: Joi.string().allow('', null).optional(),
  color: Joi.string().allow('', null).optional(),
  status: Joi.string().allow('', null).optional(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

const updateEventSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  startTime: Joi.date().iso().optional(),
  endTime: Joi.date().iso().optional(),
  location: Joi.string().allow('', null).optional(),
  color: Joi.string().allow('', null).optional(),
  status: Joi.string().allow('', null).optional(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

const createNoteSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().allow('', null).optional(),
  date: Joi.date().iso().required(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

const updateNoteSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().allow('', null).optional(),
  date: Joi.date().iso().optional(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

const createReminderSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
  date: Joi.date().iso().required(), // Full ISO datetime string for exact trigger
  time: Joi.string().allow('', null).optional(), // Presentation string
  repeatType: Joi.string().valid('none', 'daily', 'weekdays', 'weekly', 'monthly', 'yearly', 'custom').optional(),
  notificationType: Joi.string().allow('', null).optional(),
  notificationEmail: Joi.string().email().allow('', null).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

const updateReminderSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  date: Joi.date().iso().optional(),
  time: Joi.string().allow('', null).optional(),
  repeatType: Joi.string().valid('none', 'daily', 'weekdays', 'weekly', 'monthly', 'yearly', 'custom').optional(),
  notificationType: Joi.string().allow('', null).optional(),
  notificationEmail: Joi.string().email().allow('', null).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
  categoryId: Joi.string().uuid().allow('', null).optional()
});

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
  createCategorySchema,
  updateCategorySchema,
  createEventSchema,
  updateEventSchema,
  createNoteSchema,
  updateNoteSchema,
  createReminderSchema,
  updateReminderSchema,
  validate
};
