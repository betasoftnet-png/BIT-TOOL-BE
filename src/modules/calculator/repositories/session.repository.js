const { models } = require('../../../database/connection');


class SessionRepository {
  async create(data) {
    return await models.CalculatorSession.create(data);
  }

  async findById(id) {
    return await models.CalculatorSession.findByPk(id, {
      include: [
        { model: models.CalculatorItem, as: 'items' },
        { model: models.CalculatorCategory, as: 'category' },
        { model: models.CalculatorTag, as: 'tags' }
      ],
      order: [[{ model: models.CalculatorItem, as: 'items' }, 'sequence', 'ASC']]
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

    return await models.CalculatorSession.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        { model: models.CalculatorItem, as: 'items' }
      ],
      order: [
        ['updatedAt', 'DESC'],
        [{ model: models.CalculatorItem, as: 'items' }, 'sequence', 'ASC']
      ],
      distinct: true // Required when using include with findAndCountAll to count main model correctly
    });
  }

  async update(id, data) {
    const session = await models.CalculatorSession.findByPk(id);
    if (!session) return null;
    return await session.update(data);
  }

  async delete(id) {
    const session = await models.CalculatorSession.findByPk(id);
    if (!session) return null;
    await session.destroy();
    return true;
  }
}

module.exports = new SessionRepository();
