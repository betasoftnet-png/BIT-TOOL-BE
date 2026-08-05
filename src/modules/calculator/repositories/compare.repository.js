const { models } = require('../../../database/connection');

class CompareRepository {
  async createSession(data) {
    return await models.ComparisonSession.create(data);
  }

  async findSessionById(id) {
    return await models.ComparisonSession.findByPk(id, {
      include: [
        { model: models.ComparisonItem, as: 'items' }
      ],
      order: [[{ model: models.ComparisonItem, as: 'items' }, 'sequence', 'ASC']]
    });
  }

  async findSessionsByUserAndApp(userEmail, applicationName) {
    return await models.ComparisonSession.findAndCountAll({
      where: { userEmail, applicationName },
      include: [
        { model: models.ComparisonItem, as: 'items' }
      ],
      order: [['updatedAt', 'DESC']]
    });
  }

  async addItem(data) {
    return await models.ComparisonItem.create(data);
  }

  async updateItem(id, data) {
    const item = await models.ComparisonItem.findByPk(id);
    if (!item) return null;
    return await item.update(data);
  }

  async deleteItem(id) {
    const item = await models.ComparisonItem.findByPk(id);
    if (!item) return null;
    await item.destroy();
    return true;
  }
}

module.exports = new CompareRepository();
