const { models } = require('../../../database/connection');
const { Op } = require('sequelize');

class EventRepository {
  async create(data) {
    return await models.CalendarEvent.create(data);
  }

  async findById(id, userEmail, applicationName) {
    return await models.CalendarEvent.findOne({
      where: { id, userEmail, applicationName },
      include: [{ model: models.CalendarCategory, as: 'category' }]
    });
  }

  async findByDate(date, userEmail, applicationName) {
    // Expects date string in YYYY-MM-DD
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    
    return await models.CalendarEvent.findAll({
      where: {
        userEmail,
        applicationName,
        [Op.or]: [
          { startTime: { [Op.between]: [startOfDay, endOfDay] } },
          { endTime: { [Op.between]: [startOfDay, endOfDay] } },
          {
            startTime: { [Op.lte]: startOfDay },
            endTime: { [Op.gte]: endOfDay }
          }
        ]
      },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['startTime', 'ASC']]
    });
  }

  async findByMonth(year, month, userEmail, applicationName) {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    
    return await models.CalendarEvent.findAll({
      where: {
        userEmail,
        applicationName,
        [Op.or]: [
          { startTime: { [Op.between]: [startDate, endDate] } },
          { endTime: { [Op.between]: [startDate, endDate] } },
          {
            startTime: { [Op.lte]: startDate },
            endTime: { [Op.gte]: endDate }
          }
        ]
      },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['startTime', 'ASC']]
    });
  }

  async update(id, userEmail, applicationName, data) {
    const event = await this.findById(id, userEmail, applicationName);
    if (!event) return null;
    return await event.update(data);
  }

  async delete(id, userEmail, applicationName) {
    const event = await this.findById(id, userEmail, applicationName);
    if (!event) return null;
    await event.destroy();
    return true;
  }
}

module.exports = new EventRepository();
