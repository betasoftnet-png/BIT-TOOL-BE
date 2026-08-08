const { models } = require('../../../database/connection');
const { Op } = require('sequelize');

class NoteRepository {
  async create(data) {
    return await models.CalendarNote.create(data);
  }

  async findById(id, userEmail, applicationName) {
    return await models.CalendarNote.findOne({
      where: { id, userEmail, applicationName },
      include: [{ model: models.CalendarCategory, as: 'category' }]
    });
  }

  async findByDate(date, userEmail, applicationName) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    return await models.CalendarNote.findAll({
      where: {
        userEmail,
        applicationName,
        date: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [{ model: models.CalendarCategory, as: 'category' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async update(id, userEmail, applicationName, data) {
    const note = await this.findById(id, userEmail, applicationName);
    if (!note) return null;
    return await note.update(data);
  }

  async delete(id, userEmail, applicationName) {
    const note = await this.findById(id, userEmail, applicationName);
    if (!note) return null;
    await note.destroy();
    return true;
  }
}

module.exports = new NoteRepository();
