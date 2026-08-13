module.exports = (sequelize, DataTypes) => {
  const NoteTag = sequelize.define('NoteTag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#e0e0e0',
    }
  });

  NoteTag.associate = (models) => {
    NoteTag.belongsToMany(models.Note, { through: 'NoteTagMapping', as: 'notes', foreignKey: 'tagId', otherKey: 'noteId' });
  };

  return NoteTag;
};
