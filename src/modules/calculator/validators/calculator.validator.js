const Joi = require('joi');

const createSessionSchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  currency: Joi.string().length(3).optional(),
  categoryId: Joi.string().uuid().allow(null).optional(),
  mode: Joi.string().valid('normal', 'business', 'scientific', 'compare').optional(),
  notes: Joi.string().allow('', null).optional(),
});

const updateSessionSchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  currency: Joi.string().length(3).optional(),
  categoryId: Joi.string().uuid().allow(null).optional(),
  mode: Joi.string().valid('normal', 'business', 'scientific', 'compare').optional(),
  status: Joi.string().valid('active', 'completed', 'draft').optional(),
  notes: Joi.string().allow('', null).optional(),
  isArchived: Joi.boolean().optional(),
});

const addItemSchema = Joi.object({
  sequence: Joi.number().integer().min(1).required(),
  label: Joi.string().allow('', null).optional(),
  expression: Joi.string().allow('', null).optional(),
  operator: Joi.string().max(5).allow('', null).optional(),
  value: Joi.number().required(),
  runningTotal: Joi.number().required(),
  remarks: Joi.string().allow('', null).optional(),
});

const updateItemSchema = Joi.object({
  label: Joi.string().allow('', null).optional(),
  expression: Joi.string().allow('', null).optional(),
  operator: Joi.string().max(5).allow('', null).optional(),
  value: Joi.number().optional(),
  remarks: Joi.string().allow('', null).optional(),
});

const applyBusinessLogicSchema = Joi.object({
  operation: Joi.string().valid('gst_inclusive', 'gst_exclusive', 'markup', 'margin', 'discount').required(),
  value: Joi.number().required(),
  parameter: Joi.number().required(), // e.g. the percentage
  label: Joi.string().allow('', null).optional(),
});

const createTagSchema = Joi.object({
  name: Joi.string().required()
});

const exportSchema = Joi.object({
  format: Joi.string().valid('pdf', 'excel', 'invoice', 'expense', 'payroll').required()
});

const createCompareSessionSchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  vendorA_Name: Joi.string().allow('', null).optional(),
  vendorB_Name: Joi.string().allow('', null).optional(),
  currency: Joi.string().length(3).optional()
});

const updateCompareSessionSchema = Joi.object({
  title: Joi.string().allow('', null).optional(),
  vendorA_Name: Joi.string().allow('', null).optional(),
  vendorB_Name: Joi.string().allow('', null).optional(),
  currency: Joi.string().length(3).optional(),
  isArchived: Joi.boolean().optional()
});

const addCompareItemSchema = Joi.object({
  sequence: Joi.number().integer().min(1).required(),
  label: Joi.string().allow('', null).optional(),
  vendorA_Value: Joi.number().required(),
  vendorB_Value: Joi.number().required()
});

const updateCompareItemSchema = Joi.object({
  label: Joi.string().allow('', null).optional(),
  vendorA_Value: Joi.number().optional(),
  vendorB_Value: Joi.number().optional()
});

// Middleware factory for Joi validation
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors,
      });
    }
    next();
  };
};

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  addItemSchema,
  updateItemSchema,
  applyBusinessLogicSchema,
  createTagSchema,
  exportSchema,
  createCompareSessionSchema,
  updateCompareSessionSchema,
  addCompareItemSchema,
  updateCompareItemSchema,
  validate
};
