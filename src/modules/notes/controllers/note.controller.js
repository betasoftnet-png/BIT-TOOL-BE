const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const AppError = require('../../../shared/exceptions/AppError');
const NoteService = require('../services/note.service');

const createNote = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const applicationName = req.user.appName || 'Bit Tool';
    
    const note = await NoteService.createNote(userEmail, applicationName, req.body);
    return ApiResponse.created(res, note, 'Note created successfully');
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const applicationName = req.user.appName || 'Bit Tool';
    
    const notes = await NoteService.getNotes(userEmail, applicationName, req.query);
    return ApiResponse.success(res, notes);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await NoteService.getNoteById(req.params.id);
    
    if (!note) {
      throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    }
    
    return ApiResponse.success(res, note);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await NoteService.updateNote(req.params.id, req.body);
    
    if (!note) {
      throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    }
    
    return ApiResponse.success(res, note, 'Note updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const success = await NoteService.deleteNote(req.params.id);
    
    if (!success) {
      throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    }
    
    return ApiResponse.success(res, null, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
