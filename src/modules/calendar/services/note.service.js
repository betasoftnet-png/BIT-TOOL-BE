const noteRepo = require('../repositories/note.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class NoteService {
  async createNote(userEmail, applicationName, data) {
    return await noteRepo.create({ ...data, userEmail, applicationName });
  }

  async getNote(id, userEmail, applicationName) {
    const note = await noteRepo.findById(id, userEmail, applicationName);
    if (!note) throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    return note;
  }

  async getNotesByDate(date, userEmail, applicationName) {
    return await noteRepo.findByDate(date, userEmail, applicationName);
  }

  async updateNote(id, userEmail, applicationName, data) {
    const updated = await noteRepo.update(id, userEmail, applicationName, data);
    if (!updated) throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    return updated;
  }

  async deleteNote(id, userEmail, applicationName) {
    const deleted = await noteRepo.delete(id, userEmail, applicationName);
    if (!deleted) throw new AppError('Note not found', StatusCodes.NOT_FOUND);
    return true;
  }
}

module.exports = new NoteService();
