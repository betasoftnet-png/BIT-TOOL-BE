const { models } = require('../../../database/connection');

const { Op } = require('sequelize');

class ItemRepository {
  async create(data, transaction = null) {
    return await models.CalculatorItem.create(data, { transaction });
  }

  async findById(id) {
    return await models.CalculatorItem.findByPk(id);
  }

  async findBySessionId(sessionId, transaction = null) {
    return await models.CalculatorItem.findAll({
      where: { sessionId },
      order: [['sequence', 'ASC']],
      transaction
    });
  }

  async findSubsequentItems(sessionId, sequence, transaction = null) {
    return await models.CalculatorItem.findAll({
      where: {
        sessionId,
        sequence: {
          [Op.gt]: sequence
        }
      },
      order: [['sequence', 'ASC']],
      transaction
    });
  }

  async update(id, data, transaction = null) {
    const item = await models.CalculatorItem.findByPk(id, { transaction });
    if (!item) return null;
    return await item.update(data, { transaction });
  }

  async delete(id, transaction = null) {
    const item = await models.CalculatorItem.findByPk(id, { transaction });
    if (!item) return null;
    await item.destroy({ transaction });
    return true;
  }
  
  async bulkUpdate(items, transaction = null) {
    const promises = items.map(item => 
      models.CalculatorItem.update(
        { runningTotal: item.runningTotal, value: item.value, operator: item.operator }, 
        { where: { id: item.id }, transaction }
      )
    );
    return Promise.all(promises);
  }
}

module.exports = new ItemRepository();
