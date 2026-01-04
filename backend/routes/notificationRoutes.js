const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController')

router.get('/', controller.getNotifications);
router.get('/unread', controller.getUnreadCount);
router.put('/mark-read', controller.markAsRead);
router.delete('/:id', controller.deleteNotification);
router.delete('/all/:userId', controller.deleteAllNotifications);

module.exports = router;