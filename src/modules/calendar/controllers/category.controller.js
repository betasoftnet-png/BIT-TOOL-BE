const categoryService = require('../services/category.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createCategory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const category = await categoryService.createCategory(email, appName, req.body);
    return ApiResponse.success(res, category, 'Category created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const category = await categoryService.getCategory(req.params.id, email, appName);
    return ApiResponse.success(res, category, 'Category retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const categories = await categoryService.getAllCategories(email, appName);
    return ApiResponse.success(res, categories, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const category = await categoryService.updateCategory(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, category, 'Category updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await categoryService.deleteCategory(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Category deleted successfully');
  } catch (error) {
    next(error);
  }
};
