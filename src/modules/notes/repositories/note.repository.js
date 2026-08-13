const { models } = require('../../../database/connection');

class NoteRepository {
  async create(data) {
    return await models.Note.create(data, {
      include: [
        { model: models.NoteItem, as: 'items' }
      ]
    });
  }

  async findByUserAndApp(userEmail, applicationName, query = {}) {
    const { isArchived = false, isPinned, allApps } = query;
    
    // Base where clause requires userEmail
    const whereClause = { userEmail };
    
    // Only filter by applicationName if allApps is not true
    if (allApps !== 'true' && allApps !== true) {
      whereClause.applicationName = applicationName;
    }
    
    if (isArchived !== undefined && isArchived !== '') {
      whereClause.isArchived = isArchived === 'true' || isArchived === true;
    }
    
    if (isPinned !== undefined && isPinned !== '') {
      whereClause.isPinned = isPinned === 'true' || isPinned === true;
    }

    return await models.Note.findAll({
      where: whereClause,
      include: [
        { model: models.NoteItem, as: 'items' },
        { model: models.NoteTag, as: 'tags', through: { attributes: [] } }
      ],
      order: [
        ['isPinned', 'DESC'],
        ['updatedAt', 'DESC'],
        [{ model: models.NoteItem, as: 'items' }, 'sequence', 'ASC']
      ]
    });
  }

  async findById(id) {
    return await models.Note.findByPk(id, {
      include: [
        { model: models.NoteItem, as: 'items' },
        { model: models.NoteTag, as: 'tags', through: { attributes: [] } }
      ],
      order: [
        [{ model: models.NoteItem, as: 'items' }, 'sequence', 'ASC']
      ]
    });
  }

  async update(id, data) {
    const note = await models.Note.findByPk(id);
    if (!note) return null;
    return await note.update(data);
  }

  async delete(id) {
    const note = await models.Note.findByPk(id);
    if (!note) return false;
    await note.destroy();
    return true;
  }
}

module.exports = new NoteRepository();
