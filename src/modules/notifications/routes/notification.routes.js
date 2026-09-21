const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All notification routes require authentication
router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

module.exports = router;
