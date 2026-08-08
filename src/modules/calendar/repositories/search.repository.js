const { models } = require('../../../database/connection');
const { Op } = require('sequelize');

class SearchRepository {
  async unifiedSearch(userEmail, applicationName, filters) {
    const { query, categoryId, startDate, endDate, status } = filters;
    
    const results = {
      events: [],
      notes: [],
      reminders: []
    };

    const commonWhere = { userEmail, applicationName };
    if (categoryId) commonWhere.categoryId = categoryId;

    // Build text search
    let textSearchEvent = {};
    let textSearchNote = {};
    let textSearchReminder = {};
    
    if (query) {
      const iLikeQuery = `%${query}%`;
      textSearchEvent = {
        [Op.or]: [
          { title: { [Op.iLike]: iLikeQuery } },
          { description: { [Op.iLike]: iLikeQuery } }
        ]
      };
      textSearchNote = {
        [Op.or]: [
          { title: { [Op.iLike]: iLikeQuery } },
          { content: { [Op.iLike]: iLikeQuery } }
        ]
      };
      textSearchReminder = {
        [Op.or]: [
          { title: { [Op.iLike]: iLikeQuery } },
          { description: { [Op.iLike]: iLikeQuery } }
        ]
      };
    }

    // Build Date Search
    let dateSearchEvent = {};
    let dateSearchNoteReminder = {};
    
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      
      dateSearchEvent = {
        [Op.or]: [
          { startTime: { [Op.between]: [start, end] } },
          { endTime: { [Op.between]: [start, end] } },
          { startTime: { [Op.lte]: start }, endTime: { [Op.gte]: end } }
        ]
      };
      dateSearchNoteReminder = {
        date: { [Op.between]: [start, end] }
      };
    }

    // Queries
    results.events = await models.CalendarEvent.findAll({
      where: { ...commonWhere, ...textSearchEvent, ...dateSearchEvent },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['startTime', 'ASC']]
    });

    results.notes = await models.CalendarNote.findAll({
      where: { ...commonWhere, ...textSearchNote, ...dateSearchNoteReminder },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['date', 'ASC']]
    });

    const reminderWhere = { ...commonWhere, ...textSearchReminder, ...dateSearchNoteReminder };
    if (status) reminderWhere.status = status; // pending or completed
    
    results.reminders = await models.CalendarReminder.findAll({
      where: reminderWhere,
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['date', 'ASC']]
    });

    return results;
  }
}

module.exports = new SearchRepository();
