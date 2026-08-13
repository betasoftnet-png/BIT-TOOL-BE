const express = require('express');
const noteController = require('../controllers/note.controller');

const router = express.Router();


router.post('/create', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/update/:id', noteController.updateNote);
router.delete('/delete/:id', noteController.deleteNote);

module.exports = router;
