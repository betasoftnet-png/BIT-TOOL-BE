const categoryRepo = require('../repositories/category.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class CategoryService {
  async createCategory(userEmail, applicationName, data) {
    return await categoryRepo.create({ ...data, userEmail, applicationName });
  }

  async getCategory(id, userEmail, applicationName) {
    const category = await categoryRepo.findById(id, userEmail, applicationName);
    if (!category) throw new AppError('Category not found', StatusCodes.NOT_FOUND);
    return category;
  }

  async getAllCategories(userEmail, applicationName) {
    return await categoryRepo.findAll(userEmail, applicationName);
  }

  async updateCategory(id, userEmail, applicationName, data) {
    const updated = await categoryRepo.update(id, userEmail, applicationName, data);
    if (!updated) throw new AppError('Category not found', StatusCodes.NOT_FOUND);
    return updated;
  }

  async deleteCategory(id, userEmail, applicationName) {
    const deleted = await categoryRepo.delete(id, userEmail, applicationName);
    if (!deleted) throw new AppError('Category not found', StatusCodes.NOT_FOUND);
    return true;
  }
}

module.exports = new CategoryService();
