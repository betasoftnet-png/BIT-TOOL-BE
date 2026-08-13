const express = require('express');
const noteController = require('../controllers/note.controller');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

const router = express.Router();

router.use(requireAuth);

router.post('/create', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/update/:id', noteController.updateNote);
router.delete('/delete/:id', noteController.deleteNote);

module.exports = router;
