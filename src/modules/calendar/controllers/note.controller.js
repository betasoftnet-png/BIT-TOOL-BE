const noteService = require('../services/note.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createNote = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const note = await noteService.createNote(email, appName, req.body);
    return ApiResponse.success(res, note, 'Note created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getNote = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const note = await noteService.getNote(req.params.id, email, appName);
    return ApiResponse.success(res, note, 'Note retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getNotesByDate = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { date } = req.query; // YYYY-MM-DD
    const notes = await noteService.getNotesByDate(date, email, appName);
    return ApiResponse.success(res, notes, 'Notes retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const note = await noteService.updateNote(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, note, 'Note updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await noteService.deleteNote(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};
