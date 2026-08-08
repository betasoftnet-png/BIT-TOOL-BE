const { models } = require('../../../database/connection');

class CategoryRepository {
  async create(data) {
    return await models.CalendarCategory.create(data);
  }

  async findById(id, userEmail, applicationName) {
    return await models.CalendarCategory.findOne({
      where: { id, userEmail, applicationName }
    });
  }

  async findAll(userEmail, applicationName) {
    return await models.CalendarCategory.findAll({
      where: { userEmail, applicationName },
      order: [['name', 'ASC']]
    });
  }

  async update(id, userEmail, applicationName, data) {
    const category = await this.findById(id, userEmail, applicationName);
    if (!category) return null;
    return await category.update(data);
  }

  async delete(id, userEmail, applicationName) {
    const category = await this.findById(id, userEmail, applicationName);
    if (!category) return null;
    await category.destroy();
    return true;
  }
}

module.exports = new CategoryRepository();
