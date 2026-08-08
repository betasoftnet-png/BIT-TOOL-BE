module.exports = (sequelize, DataTypes) => {
  const CalendarReminder = sequelize.define('CalendarReminder', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE, // Storing full timestamp for exact triggering
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING, // e.g. '14:30' for UI convenience, actual trigger logic relies on date
      allowNull: true,
    },
    repeatType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'none' // none, daily, weekdays, weekly, monthly, yearly, custom
    },
    notificationType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'email'
    },
    notificationEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationScheduledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notificationStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending' // pending, scheduled, cancelled, failed, sent
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending' // pending, completed
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  }, {
    tableName: 'calendar_reminders',
    timestamps: true,
    paranoid: true,
  });

  CalendarReminder.associate = (models) => {
    CalendarReminder.belongsTo(models.CalendarCategory, { foreignKey: 'categoryId', as: 'category' });
  };

  return CalendarReminder;
};
