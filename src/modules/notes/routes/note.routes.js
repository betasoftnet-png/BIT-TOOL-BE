const express = require('express');
const { protect } = require('../../../shared/middlewares/auth');
const extractAppMeta = require('../../../shared/middlewares/extractAppMeta');
const noteController = require('../controllers/note.controller');

const router = express.Router();

router.use(protect);
router.use(extractAppMeta);

router.post('/create', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/update/:id', noteController.updateNote);
router.delete('/delete/:id', noteController.deleteNote);

module.exports = router;
