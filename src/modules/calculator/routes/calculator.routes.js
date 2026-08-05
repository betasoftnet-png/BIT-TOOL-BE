const express = require('express');
const router = express.Router();
const calculatorController = require('../controllers/calculator.controller');
const { validate, createSessionSchema, updateSessionSchema, addItemSchema, updateItemSchema, applyBusinessLogicSchema, createTagSchema, exportSchema } = require('../validators/calculator.validator');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All calculator routes require authentication
router.use(requireAuth);

// Session Routes
router.post('/sessions', validate(createSessionSchema), calculatorController.createSession);
router.get('/history', calculatorController.getHistory);
router.get('/sessions/:id', calculatorController.getSession);
router.put('/sessions/:id', validate(updateSessionSchema), calculatorController.updateSession);
router.delete('/sessions/:id', calculatorController.deleteSession);
router.delete('/sessions', calculatorController.clearHistory);
router.post('/sessions/:id/archive', calculatorController.archiveSession);
router.post('/sessions/:id/restore', calculatorController.restoreSession);

// Tape Item Routes
router.post('/sessions/:sessionId/items', validate(addItemSchema), calculatorController.addItem);
router.put('/sessions/:sessionId/items/:id', validate(updateItemSchema), calculatorController.updateItem);
router.delete('/sessions/:sessionId/items/:id', calculatorController.deleteItem);

// Advanced Business Logic
router.post('/sessions/:sessionId/apply-business-logic', validate(applyBusinessLogicSchema), calculatorController.applyBusinessLogic);

// Tags
router.post('/tags', validate(createTagSchema), calculatorController.createTag);
router.post('/sessions/:sessionId/tags/:tagId', calculatorController.assignTag);

// Export & Sharing
router.post('/sessions/:sessionId/share', calculatorController.generateShareLink);
router.post('/sessions/:sessionId/export', validate(exportSchema), calculatorController.exportSession);

// Note: This route is unauthenticated theoretically (if sharing publicly), 
// but we'll leave it here and maybe bypass auth in production for this specific route.
router.get('/share/:token', calculatorController.getSharedSession);

module.exports = router;
