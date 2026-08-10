const reminderRepo = require('../repositories/reminder.repository');
const notificationService = require('./notification.service');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class ReminderService {
  async createReminder(userEmail, applicationName, data) {
    // Basic payload
    let payload = { ...data, userEmail, applicationName };

    // Auto-fill notification details if the frontend omits them
    if (!payload.notificationType) payload.notificationType = 'email';
    if (!payload.notificationEmail) payload.notificationEmail = userEmail;

    // Schedule notification if requested
    if (payload.notificationType === 'email' && payload.notificationEmail) {
      const scheduleResult = await notificationService.scheduleNotification(payload);
      payload = { ...payload, ...scheduleResult };
    }

    return await reminderRepo.create(payload);
  }

  async getReminder(id, userEmail, applicationName) {
    const reminder = await reminderRepo.findById(id, userEmail, applicationName);
    if (!reminder) throw new AppError('Reminder not found', StatusCodes.NOT_FOUND);
    return reminder;
  }

  async getRemindersByDate(date, userEmail, applicationName) {
    return await reminderRepo.findByDate(date, userEmail, applicationName);
  }

  async getRemindersByStatus(status, userEmail, applicationName) {
    return await reminderRepo.findByStatus(status, userEmail, applicationName);
  }

  async getUpcomingReminders(userEmail, applicationName) {
    return await reminderRepo.findUpcoming(userEmail, applicationName);
  }

  async updateReminder(id, userEmail, applicationName, data) {
    const existing = await this.getReminder(id, userEmail, applicationName);
    
    let payload = { ...data };

    // Auto-fill fallback for update if they are missing
    const currentNotificationType = payload.notificationType || existing.notificationType || 'email';
    const currentNotificationEmail = payload.notificationEmail || existing.notificationEmail || userEmail;
    
    // Set them in payload so they are saved to DB
    payload.notificationType = currentNotificationType;
    payload.notificationEmail = currentNotificationEmail;

    // Check if notification details changed
    const needsReschedule = 
      (data.date && new Date(data.date).toISOString() !== new Date(existing.date).toISOString()) ||
      (currentNotificationEmail !== existing.notificationEmail) ||
      (data.title && data.title !== existing.title);

    if (needsReschedule && currentNotificationType === 'email') {
      const dummyReminder = { ...existing.toJSON(), ...payload }; // Merge to construct full object for reschedule
      if (dummyReminder.notificationEmail) {
        const scheduleResult = await notificationService.rescheduleNotification(dummyReminder, existing.notificationId);
        payload = { ...payload, ...scheduleResult };
      } else if (existing.notificationId) {
        // notificationEmail was removed (shouldn't happen with fallback, but safe), cancel existing
        await notificationService.cancelNotification(existing.notificationId);
        payload.notificationId = null;
        payload.notificationStatus = 'cancelled';
        payload.notificationScheduledAt = null;
      }
    }

    const updated = await reminderRepo.update(id, userEmail, applicationName, payload);
    if (!updated) throw new AppError('Reminder not found', StatusCodes.NOT_FOUND);
    return updated;
  }

  async markAsCompleted(id, userEmail, applicationName) {
    const existing = await this.getReminder(id, userEmail, applicationName);
    
    let payload = { status: 'completed' };

    if (existing.notificationId && existing.notificationStatus !== 'cancelled') {
      await notificationService.cancelNotification(existing.notificationId);
      payload.notificationStatus = 'cancelled';
    }

    const updated = await reminderRepo.update(id, userEmail, applicationName, payload);
    if (!updated) throw new AppError('Reminder not found', StatusCodes.NOT_FOUND);
    return updated;
  }

  async deleteReminder(id, userEmail, applicationName) {
    const existing = await this.getReminder(id, userEmail, applicationName);
    
    if (existing.notificationId && existing.notificationStatus !== 'cancelled') {
      await notificationService.cancelNotification(existing.notificationId);
    }

    const deleted = await reminderRepo.delete(id, userEmail, applicationName);
    if (!deleted) throw new AppError('Reminder not found', StatusCodes.NOT_FOUND);
    return true;
  }
}

module.exports = new ReminderService();
