const compareService = require('../services/compare.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await compareService.createSession(email, appName, req.body);
    return ApiResponse.success(res, session, 'Comparison session created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await compareService.getSessionById(req.params.id, email, appName);
    return ApiResponse.success(res, session, 'Comparison session retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const history = await compareService.getHistory(email, appName, req.query);
    return ApiResponse.success(res, history, 'History retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await compareService.updateSession(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, session, 'Comparison session updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await compareService.deleteSession(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Comparison session deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const item = await compareService.addItem(sessionId, email, appName, req.body);
    return ApiResponse.success(res, item, 'Item added successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    const session = await compareService.updateItem(id, sessionId, email, appName, req.body);
    return ApiResponse.success(res, session, 'Item updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    const session = await compareService.deleteItem(id, sessionId, email, appName);
    return ApiResponse.success(res, session, 'Item deleted successfully');
  } catch (error) {
    next(error);
  }
};
