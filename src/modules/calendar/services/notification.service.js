const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class NotificationService {
  getHeaders() {
    const token = process.env.BNX_MAIL_TOKEN;
    if (!token) throw new AppError('BNX Mail Token is missing in configuration', StatusCodes.INTERNAL_SERVER_ERROR);
    
    return {
      'X-Public-Mail-Token': token,
      'Content-Type': 'application/json'
    };
  }

  async scheduleNotification(reminder) {
    console.log('--- [BNX Mail] Starting Schedule Process ---');
    console.log('[BNX Mail] Reminder Payload:', JSON.stringify(reminder, null, 2));

    const scheduleUrl = process.env.BNX_MAIL_SCHEDULE_URL;
    if (!scheduleUrl) {
      console.error('[BNX Mail] ERROR: BNX_MAIL_SCHEDULE_URL is missing in .env');
      throw new AppError('BNX Mail Schedule URL is missing', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    if (!reminder.notificationEmail) {
      console.error('[BNX Mail] ERROR: No notificationEmail provided in the payload.');
      throw new AppError('Notification email is required to schedule an email', StatusCodes.BAD_REQUEST);
    }

    const eventDate = new Date(reminder.date);
    const now = new Date();
    
    console.log(`[BNX Mail] Event Date: ${eventDate.toISOString()} | Current Time: ${now.toISOString()}`);

    // Intervals in minutes (24h, 12h, 5h, 1h, 5m, 0m at the exact time)
    const intervalsInMinutes = [24 * 60, 12 * 60, 5 * 60, 60, 5, 0];
    const scheduledIds = [];
    const scheduledTimes = [];

    for (const minsBefore of intervalsInMinutes) {
      const sendAtDate = new Date(eventDate.getTime() - minsBefore * 60 * 1000);
      
      // Only schedule if the calculated time is actually in the future!
      if (sendAtDate > now) {
        const sendAt = sendAtDate.toISOString();
        const url = `${scheduleUrl}?sendAt=${sendAt}`;
        
        console.log(`[BNX Mail] Scheduling interval: -${minsBefore}m at exact time: ${sendAt}`);

        let prefixText = '';
        if (minsBefore === 24 * 60) prefixText = 'Tomorrow is your reminder: ';
        else if (minsBefore === 12 * 60) prefixText = 'In 12 hours: ';
        else if (minsBefore === 5 * 60) prefixText = 'In 5 hours: ';
        else if (minsBefore === 60) prefixText = 'Starting in 1 hour: ';
        else if (minsBefore === 5) prefixText = 'Starting in 5 minutes: ';
        else prefixText = 'It is time: '; // 0 mins

        const beautifulHtml = `
          <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px; border-radius: 12px;">
            <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); text-align: center;">
              <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 24px; display: inline-flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 16px;">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h1 style="margin: 0 0 12px; font-size: 24px; font-weight: 700; color: #111827;">Bit Tool Reminder</h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #6b7280; font-weight: 500;">
                <span style="color: #4f46e5; font-weight: 600;">${prefixText}</span> ${reminder.title}
              </p>
              ${reminder.description ? `<div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 32px; text-align: left;"><p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">${reminder.description}</p></div>` : ''}
              
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                  Powered by <strong style="color: #6366f1; font-weight: 500;">Bit Tool Calendar</strong> &amp; BNX Mail
                </p>
              </div>
            </div>
          </div>
        `;

        const body = {
          to: reminder.notificationEmail,
          cc: '',
          bcc: '',
          subject: `Reminder: ${reminder.title}`,
          body: beautifulHtml,
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
            console.error(`[BNX Mail] ERROR from BNX API for ${minsBefore}m interval: Status ${response.status}, Body: ${errText}`);
            continue; // Skip this one, try the next
          }

          const data = await response.json();
          console.log(`[BNX Mail] SUCCESS API Response for ${minsBefore}m:`, JSON.stringify(data));
          
          const notificationId = data?.data?.id || data?.id || data?.notificationId || data?.data?.notificationId;
          
          if (notificationId) {
            scheduledIds.push(notificationId);
            scheduledTimes.push(sendAt);
          } else {
             console.warn(`[BNX Mail] WARNING: BNX Mail succeeded but didn't return an obvious ID. Response data:`, data);
          }
        } catch (error) {
          console.error(`[BNX Mail] FATAL Network error scheduling ${minsBefore}m interval: ${error.message}`);
        }
      } else {
        console.log(`[BNX Mail] Skipping interval -${minsBefore}m because calculated time (${sendAtDate.toISOString()}) is in the past.`);
      }
    }

    console.log(`[BNX Mail] Finished scheduling. IDs generated: ${scheduledIds.join(',')}`);
    return {
      notificationId: scheduledIds.length > 0 ? scheduledIds.join(',') : null,
      notificationScheduledAt: scheduledTimes.length > 0 ? new Date(scheduledTimes[0]) : null, // Store the first scheduled time
      notificationStatus: scheduledIds.length > 0 ? 'scheduled' : 'pending'
    };
  }

  async cancelNotification(notificationIds) {
    if (!notificationIds) return;

    const cancelUrl = process.env.BNX_MAIL_CANCEL_URL;
    if (!cancelUrl) throw new AppError('BNX Mail Cancel URL is missing', StatusCodes.INTERNAL_SERVER_ERROR);

    const idsToCancel = notificationIds.split(',');

    for (const id of idsToCancel) {
      const url = `${cancelUrl}/${id.trim()}`;

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          headers: this.getHeaders()
        });

        if (!response.ok) {
          if (response.status !== 404) {
             console.error(`Failed to cancel BNX Mail ${id}`);
          }
        }
      } catch (error) {
         console.error(`Network error cancelling BNX Mail ${id}: ${error.message}`);
      }
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
