const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const eventController = require('../controllers/event.controller');
const noteController = require('../controllers/note.controller');
const reminderController = require('../controllers/reminder.controller');
const searchController = require('../controllers/search.controller');

const { 
  validate, 
  createCategorySchema, 
  updateCategorySchema,
  createEventSchema,
  updateEventSchema,
  createNoteSchema,
  updateNoteSchema,
  createReminderSchema,
  updateReminderSchema
} = require('../validators/calendar.validator');

const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All calendar routes require authentication
router.use(requireAuth);

// ---------------------------------
// Unified Search
// ---------------------------------
router.get('/search', searchController.search);

// ---------------------------------
// Categories
// ---------------------------------
router.post('/categories', validate(createCategorySchema), categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategory);
router.put('/categories/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// ---------------------------------
// Events
// ---------------------------------
router.post('/events', validate(createEventSchema), eventController.createEvent);
router.get('/events', eventController.getEventsByDate); // uses ?date=YYYY-MM-DD
router.get('/events/month', eventController.getEventsByMonth); // uses ?year=YYYY&month=MM
router.get('/events/:id', eventController.getEvent);
router.put('/events/:id', validate(updateEventSchema), eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

// ---------------------------------
// Notes
// ---------------------------------
router.post('/notes', validate(createNoteSchema), noteController.createNote);
router.get('/notes', noteController.getNotesByDate); // uses ?date=YYYY-MM-DD
router.get('/notes/:id', noteController.getNote);
router.put('/notes/:id', validate(updateNoteSchema), noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

// ---------------------------------
// Reminders
// ---------------------------------
router.post('/reminders', validate(createReminderSchema), reminderController.createReminder);
router.get('/reminders', reminderController.getRemindersByDate); // uses ?date=YYYY-MM-DD
router.get('/reminders/upcoming', reminderController.getUpcomingReminders);
router.get('/reminders/pending', reminderController.getPendingReminders);
router.get('/reminders/completed', reminderController.getCompletedReminders);
router.get('/reminders/:id', reminderController.getReminder);
router.put('/reminders/:id', validate(updateReminderSchema), reminderController.updateReminder);
router.put('/reminders/:id/complete', reminderController.markReminderCompleted);
router.delete('/reminders/:id', reminderController.deleteReminder);

module.exports = router;
