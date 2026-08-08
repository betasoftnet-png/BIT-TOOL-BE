module.exports = (sequelize, DataTypes) => {
  const CalendarCategory = sequelize.define('CalendarCategory', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '#3B82F6' // Default blue
    }
  }, {
    tableName: 'calendar_categories',
    timestamps: true,
    paranoid: true,
  });

  CalendarCategory.associate = (models) => {
    CalendarCategory.hasMany(models.CalendarEvent, { foreignKey: 'categoryId', as: 'events' });
    CalendarCategory.hasMany(models.CalendarNote, { foreignKey: 'categoryId', as: 'notes' });
    CalendarCategory.hasMany(models.CalendarReminder, { foreignKey: 'categoryId', as: 'reminders' });
  };

  return CalendarCategory;
};
