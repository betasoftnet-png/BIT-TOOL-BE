const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class NotificationService {
  getHeaders() {
    const token = process.env.BNX_MAIL_TOKEN;
    if (!token) throw new AppError('BNX Mail Token is missing in configuration', StatusCodes.INTERNAL_SERVER_ERROR);
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async scheduleNotification(reminder) {
    const scheduleUrl = process.env.BNX_MAIL_SCHEDULE_URL;
    if (!scheduleUrl) throw new AppError('BNX Mail Schedule URL is missing', StatusCodes.INTERNAL_SERVER_ERROR);

    if (!reminder.notificationEmail) {
      throw new AppError('Notification email is required to schedule an email', StatusCodes.BAD_REQUEST);
    }

    const sendAt = new Date(reminder.date).toISOString();
    const url = `${scheduleUrl}?sendAt=${sendAt}`;

    const body = {
      to: reminder.notificationEmail,
      cc: '',
      bcc: '',
      subject: `Reminder: ${reminder.title}`,
      body: `<h2>Bit Tool Reminder</h2><p>${reminder.title}</p><p>${reminder.description || ''}</p>`,
      fromName: 'Bit Tool',
      isHtml: true,
      attachments: []
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new AppError(`Failed to schedule BNX Mail: ${errText}`, StatusCodes.BAD_GATEWAY);
      }

      const data = await response.json();
      // Assuming BNX Mail returns the scheduled ID somewhere in the response.
      // Often it's in data.data.id or data.id or data.notificationId depending on their structure.
      // We'll extract what we can safely.
      const notificationId = data?.data?.id || data?.id || data?.notificationId || data?.data?.notificationId;
      
      return {
        notificationId,
        notificationScheduledAt: sendAt,
        notificationStatus: 'scheduled'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Network error scheduling BNX Mail: ${error.message}`, StatusCodes.BAD_GATEWAY);
    }
  }

  async cancelNotification(notificationId) {
    if (!notificationId) return;

    const cancelUrl = process.env.BNX_MAIL_CANCEL_URL;
    if (!cancelUrl) throw new AppError('BNX Mail Cancel URL is missing', StatusCodes.INTERNAL_SERVER_ERROR);

    const url = `${cancelUrl}/${notificationId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        // We log and optionally throw. If it's a 404 (already deleted/sent), we might want to ignore.
        if (response.status !== 404) {
           const errText = await response.text();
           console.error(`Failed to cancel BNX Mail ${notificationId}: ${errText}`);
           // Depending on strictness, we might throw or just log.
           // throw new AppError(`Failed to cancel BNX Mail: ${errText}`, StatusCodes.BAD_GATEWAY);
        }
      }
    } catch (error) {
       console.error(`Network error cancelling BNX Mail ${notificationId}: ${error.message}`);
       // throw new AppError(`Network error cancelling BNX Mail: ${error.message}`, StatusCodes.BAD_GATEWAY);
    }
  }

  async rescheduleNotification(reminder, oldNotificationId) {
    if (oldNotificationId) {
      await this.cancelNotification(oldNotificationId);
    }
    return await this.scheduleNotification(reminder);
  }
}

module.exports = new NotificationService();
