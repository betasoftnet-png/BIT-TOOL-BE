const NoteRepository = require('../repositories/note.repository');

class NoteService {
  async createNote(userEmail, applicationName, data) {
    const noteData = {
      ...data,
      userEmail,
      applicationName
    };
    return await NoteRepository.create(noteData);
  }

  async getNotes(userEmail, applicationName, query) {
    return await NoteRepository.findByUserAndApp(userEmail, applicationName, query);
  }

  async getNoteById(id) {
    return await NoteRepository.findById(id);
  }

  async updateNote(id, data) {
    return await NoteRepository.update(id, data);
  }

  async deleteNote(id) {
    return await NoteRepository.delete(id);
  }
}

module.exports = new NoteService();
