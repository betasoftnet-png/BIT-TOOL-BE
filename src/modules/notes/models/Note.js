module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    applicationName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Bit Tool'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#ffffff',
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    timestamps: true,
  });

  Note.associate = (models) => {
    Note.hasMany(models.NoteItem, { as: 'items', foreignKey: 'noteId', onDelete: 'CASCADE' });
    Note.belongsToMany(models.NoteTag, { through: 'NoteTagMapping', as: 'tags', foreignKey: 'noteId', otherKey: 'tagId' });
  };

  return Note;
};
