const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validate, createContactSchema, updateContactSchema } = require('../validators/contact.validator');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All contact routes require authentication
router.use(requireAuth);

router.post('/', validate(createContactSchema), contactController.createContact);
router.get('/', contactController.getContacts);
router.get('/:id', contactController.getContact);
router.put('/:id', validate(updateContactSchema), contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
