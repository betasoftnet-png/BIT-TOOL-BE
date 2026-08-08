module.exports = (sequelize, DataTypes) => {
  const CalendarNote = sequelize.define('CalendarNote', {
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
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  }, {
    tableName: 'calendar_notes',
    timestamps: true,
    paranoid: true,
  });

  CalendarNote.associate = (models) => {
    CalendarNote.belongsTo(models.CalendarCategory, { foreignKey: 'categoryId', as: 'category' });
  };

  return CalendarNote;
};
