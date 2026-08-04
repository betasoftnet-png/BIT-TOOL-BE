const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compare.controller');
const { validate, createCompareSessionSchema, updateCompareSessionSchema, addCompareItemSchema, updateCompareItemSchema } = require('../validators/calculator.validator');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All compare routes require authentication
router.use(requireAuth);

// Session Routes
router.post('/sessions', validate(createCompareSessionSchema), compareController.createSession);
router.get('/history', compareController.getHistory);
router.get('/sessions/:id', compareController.getSession);
router.put('/sessions/:id', validate(updateCompareSessionSchema), compareController.updateSession);
router.delete('/sessions/:id', compareController.deleteSession);

// Item Routes
router.post('/sessions/:sessionId/items', validate(addCompareItemSchema), compareController.addItem);
router.put('/sessions/:sessionId/items/:id', validate(updateCompareItemSchema), compareController.updateItem);
router.delete('/sessions/:sessionId/items/:id', compareController.deleteItem);

module.exports = router;
