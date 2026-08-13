module.exports = (sequelize, DataTypes) => {
  const NoteTagMapping = sequelize.define('NoteTagMapping', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    }
  }, {
    timestamps: false
  });

  return NoteTagMapping;
};
