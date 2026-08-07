const calculatorService = require('../services/calculator.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await calculatorService.createSession(email, appName, req.body);
    return ApiResponse.success(res, session, 'Session created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await calculatorService.getSessionById(req.params.id, email, appName);
    return ApiResponse.success(res, session, 'Session retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const history = await calculatorService.getHistory(email, appName, req.query);
    return ApiResponse.success(res, history, 'History retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getAllHistory = async (req, res, next) => {
  try {
    const { email } = req.user;
    const history = await calculatorService.getAllHistory(email, req.query);
    return ApiResponse.success(res, history, 'All history retrieved successfully across applications');
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const session = await calculatorService.updateSession(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, session, 'Session updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await calculatorService.deleteSession(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Session deleted successfully');
  } catch (error) {
    next(error);
  }
};

exports.clearHistory = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const deletedCount = await calculatorService.clearHistory(email, appName);
    return ApiResponse.success(res, { count: deletedCount }, 'All history cleared successfully');
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const item = await calculatorService.addItem(sessionId, email, appName, req.body);
    return ApiResponse.success(res, item, 'Item added successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    // Returns full updated session tape
    const session = await calculatorService.updateItem(id, sessionId, email, appName, req.body);
    return ApiResponse.success(res, session, 'Item updated and tape recalculated');
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, id } = req.params;
    const session = await calculatorService.deleteItem(id, sessionId, email, appName);
    return ApiResponse.success(res, session, 'Item deleted and tape recalculated');
  } catch (error) {
    next(error);
  }
};

exports.applyBusinessLogic = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const session = await calculatorService.applyBusinessLogic(sessionId, email, appName, req.body);
    return ApiResponse.success(res, session, 'Business logic applied and item added', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.archiveSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { id } = req.params;
    await calculatorService.toggleArchive(id, email, appName, true);
    return ApiResponse.success(res, null, 'Session archived successfully');
  } catch (error) {
    next(error);
  }
};

exports.restoreSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { id } = req.params;
    await calculatorService.toggleArchive(id, email, appName, false);
    return ApiResponse.success(res, null, 'Session restored successfully');
  } catch (error) {
    next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { name } = req.body;
    const tag = await calculatorService.createTag(email, name);
    return ApiResponse.success(res, tag, 'Tag created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.assignTag = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId, tagId } = req.params;
    const session = await calculatorService.assignTag(sessionId, tagId, email, appName);
    return ApiResponse.success(res, session, 'Tag assigned successfully');
  } catch (error) {
    next(error);
  }
};

exports.generateShareLink = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const result = await calculatorService.generateShareLink(sessionId, email, appName);
    return ApiResponse.success(res, result, 'Share link generated successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getSharedSession = async (req, res, next) => {
  try {
    const { token } = req.params;
    const session = await calculatorService.getSharedSession(token);
    return ApiResponse.success(res, session, 'Shared session retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.exportSession = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { sessionId } = req.params;
    const { format } = req.body;
    
    // Simulate generation and return download URL/message
    const result = await calculatorService.exportSession(sessionId, email, appName, format);
    return ApiResponse.success(res, result, 'Export processing complete');
  } catch (error) {
    next(error);
  }
};
