const { models } = require('../../../database/connection');
const { CalculatorSession, CalculatorItem, CalculatorCategory, CalculatorTag } = models;

class SessionRepository {
  async create(data) {
    return await CalculatorSession.create(data);
  }

  async findById(id) {
    return await CalculatorSession.findByPk(id, {
      include: [
        { model: CalculatorItem, as: 'items' },
        { model: CalculatorCategory, as: 'category' },
        { model: CalculatorTag, as: 'tags' }
      ],
      order: [[{ model: CalculatorItem, as: 'items' }, 'sequence', 'ASC']]
    });
  }

  async findByUserAndApp(userEmail, applicationName, query = {}) {
    const { limit = 10, offset = 0, isArchived = false, mode, categoryId } = query;
    
    const whereClause = {
      userEmail,
      applicationName,
      isArchived
    };

    if (mode) whereClause.mode = mode;
    if (categoryId) whereClause.categoryId = categoryId;

    return await CalculatorSession.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['updatedAt', 'DESC']]
    });
  }

  async update(id, data) {
    const session = await CalculatorSession.findByPk(id);
    if (!session) return null;
    return await session.update(data);
  }

  async delete(id) {
    const session = await CalculatorSession.findByPk(id);
    if (!session) return null;
    await session.destroy();
    return true;
  }
}

module.exports = new SessionRepository();
