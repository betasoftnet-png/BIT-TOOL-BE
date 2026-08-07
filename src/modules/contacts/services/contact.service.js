const contactRepository = require('../repositories/contact.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class ContactService {
  async createContact(userEmail, applicationName, data) {
    return await contactRepository.create({
      ...data,
      userEmail,
      applicationName
    });
  }

  async getContactById(id, userEmail, applicationName) {
    const contact = await contactRepository.findById(id, userEmail, applicationName);
    if (!contact) {
      throw new AppError('Contact not found', StatusCodes.NOT_FOUND);
    }
    return contact;
  }

  async getContacts(userEmail, applicationName, query) {
    return await contactRepository.findByUserAndApp(userEmail, applicationName, query);
  }

  async getAllContacts(userEmail, query) {
    return await contactRepository.findAllByUser(userEmail, query);
  }

  async updateContact(id, userEmail, applicationName, data) {
    const updated = await contactRepository.update(id, userEmail, applicationName, data);
    if (!updated) {
      throw new AppError('Contact not found', StatusCodes.NOT_FOUND);
    }
    return updated;
  }

  async deleteContact(id, userEmail, applicationName) {
    const deleted = await contactRepository.delete(id, userEmail, applicationName);
    if (!deleted) {
      throw new AppError('Contact not found', StatusCodes.NOT_FOUND);
    }
    return true;
  }
}

module.exports = new ContactService();
