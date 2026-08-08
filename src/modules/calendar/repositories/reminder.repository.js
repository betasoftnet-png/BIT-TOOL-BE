const { models } = require('../../../database/connection');
const { Op } = require('sequelize');

class ReminderRepository {
  async create(data) {
    return await models.CalendarReminder.create(data);
  }

  async findById(id, userEmail, applicationName) {
    return await models.CalendarReminder.findOne({
      where: { id, userEmail, applicationName },
      include: [{ model: models.CalendarCategory, as: 'category' }]
    });
  }

  async findByDate(date, userEmail, applicationName) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    return await models.CalendarReminder.findAll({
      where: {
        userEmail,
        applicationName,
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['date', 'ASC']]
    });
  }

  async findByStatus(status, userEmail, applicationName, operator = Op.gte) {
    const today = new Date();
    const whereClause = {
      userEmail,
      applicationName,
      status
    };
    
    // For pending, we might just want all pending. For upcoming, we want pending + date >= today.
    // The specific filter logic is best left to service, but we can offer a generic find by status.
    return await models.CalendarReminder.findAll({
      where: whereClause,
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['date', 'ASC']]
    });
  }

  async findUpcoming(userEmail, applicationName) {
    const now = new Date();
    return await models.CalendarReminder.findAll({
      where: {
        userEmail,
        applicationName,
        status: 'pending',
        date: { [Op.gte]: now }
      },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['date', 'ASC']]
    });
  }

  async update(id, userEmail, applicationName, data) {
    const reminder = await this.findById(id, userEmail, applicationName);
    if (!reminder) return null;
    return await reminder.update(data);
  }

  async delete(id, userEmail, applicationName) {
    const reminder = await this.findById(id, userEmail, applicationName);
    if (!reminder) return null;
    await reminder.destroy();
    return true;
  }
}

module.exports = new ReminderRepository();
