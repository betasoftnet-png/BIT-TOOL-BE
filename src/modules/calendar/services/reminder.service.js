const reminderRepo = require('../repositories/reminder.repository');
const notificationService = require('./notification.service');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class ReminderService {
  async createReminder(userEmail, applicationName, data) {
    // Basic payload
    let payload = { ...data, userEmail, applicationName };

    // Schedule notification if requested
    if (data.notificationType === 'email' && data.notificationEmail) {
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

    // Check if notification details changed
    const needsReschedule = 
      (data.date && new Date(data.date).toISOString() !== new Date(existing.date).toISOString()) ||
      (data.notificationEmail && data.notificationEmail !== existing.notificationEmail) ||
      (data.title && data.title !== existing.title);

    if (needsReschedule && (data.notificationType === 'email' || existing.notificationType === 'email')) {
      const dummyReminder = { ...existing.toJSON(), ...data }; // Merge to construct full object for reschedule
      if (dummyReminder.notificationEmail) {
        const scheduleResult = await notificationService.rescheduleNotification(dummyReminder, existing.notificationId);
        payload = { ...payload, ...scheduleResult };
      } else if (existing.notificationId) {
        // notificationEmail was removed, cancel existing
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
