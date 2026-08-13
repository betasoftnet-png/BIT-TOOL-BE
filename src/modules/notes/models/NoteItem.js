module.exports = (sequelize, DataTypes) => {
  const NoteItem = sequelize.define('NoteItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }
  });

  NoteItem.associate = (models) => {
    NoteItem.belongsTo(models.Note, { foreignKey: 'noteId' });
  };

  return NoteItem;
};
