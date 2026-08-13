const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const AppError = require('../../../shared/exceptions/AppError');
const catchAsync = require('../../../shared/exceptions/catchAsync');
const NoteService = require('../services/note.service');

const createNote = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const applicationName = req.applicationName || 'Bit Tool';
  
  const note = await NoteService.createNote(userEmail, applicationName, req.body);
  
  return ApiResponse.created(res, note, 'Note created successfully');
});

const getNotes = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const applicationName = req.applicationName || 'Bit Tool';
  
  const notes = await NoteService.getNotes(userEmail, applicationName, req.query);
  
  return ApiResponse.success(res, notes);
});

const getNoteById = catchAsync(async (req, res) => {
  const note = await NoteService.getNoteById(req.params.id);
  
  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND);
  }
  
  return ApiResponse.success(res, note);
});

const updateNote = catchAsync(async (req, res) => {
  const note = await NoteService.updateNote(req.params.id, req.body);
  
  if (!note) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND);
  }
  
  return ApiResponse.success(res, note, 'Note updated successfully');
});

const deleteNote = catchAsync(async (req, res) => {
  const success = await NoteService.deleteNote(req.params.id);
  
  if (!success) {
    throw new AppError('Note not found', StatusCodes.NOT_FOUND);
  }
  
  return ApiResponse.success(res, null, 'Note deleted successfully');
});

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
