const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validate, createContactSchema, updateContactSchema } = require('../validators/contact.validator');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All contact routes require authentication
router.use(requireAuth);

router.post('/add', validate(createContactSchema), contactController.createContact);
router.get('/get', contactController.getContacts);
router.get('/get-all', contactController.getAllContacts);
router.get('/get/:id', contactController.getContact);
router.put('/update/:id', validate(updateContactSchema), contactController.updateContact);
router.put('/external/:externalId', validate(updateContactSchema), contactController.updateExternalContact);
router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;
