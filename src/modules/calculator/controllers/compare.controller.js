const compareService = require('../services/compare.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.getHistory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const history = await compareService.getHistory(email, appName);
    return ApiResponse.success(res, history, 'Compare history retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await compareService.getSession(req.params.id, email, appName);
    return ApiResponse.success(res, session, 'Compare session retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await compareService.createSession(email, appName, req.body);
    return ApiResponse.success(res, session, 'Compare session created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const item = await compareService.addItem(sessionId, email, appName, req.body);
    return ApiResponse.success(res, item, 'Compare item added successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    const session = await compareService.updateItem(id, sessionId, email, appName, req.body);
    return ApiResponse.success(res, session, 'Compare item updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    const session = await compareService.deleteItem(id, sessionId, email, appName);
    return ApiResponse.success(res, session, 'Compare item deleted successfully');
  } catch (error) {
    next(error);
  }
};
