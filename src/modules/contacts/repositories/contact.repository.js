const { models } = require('../../../database/connection');

class ContactRepository {
  async create(data) {
    return await models.Contact.create(data);
  }

  async findById(id, userEmail, applicationName) {
    return await models.Contact.findOne({
      where: { id, userEmail, applicationName }
    });
  }

  async findByUserAndApp(userEmail, applicationName, query = {}) {
    const { limit = 10, offset = 0 } = query;
    return await models.Contact.findAndCountAll({
      where: { userEmail, applicationName },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }

  async update(id, userEmail, applicationName, data) {
    const contact = await this.findById(id, userEmail, applicationName);
    if (!contact) return null;
    return await contact.update(data);
  }

  async delete(id, userEmail, applicationName) {
    const contact = await this.findById(id, userEmail, applicationName);
    if (!contact) return null;
    await contact.destroy();
    return true;
  }
}

module.exports = new ContactRepository();
