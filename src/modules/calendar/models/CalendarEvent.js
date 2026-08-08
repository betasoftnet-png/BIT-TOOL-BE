module.exports = (sequelize, DataTypes) => {
  const CalendarEvent = sequelize.define('CalendarEvent', {
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'scheduled'
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    }
  }, {
    tableName: 'calendar_events',
    timestamps: true,
    paranoid: true,
  });

  CalendarEvent.associate = (models) => {
    CalendarEvent.belongsTo(models.CalendarCategory, { foreignKey: 'categoryId', as: 'category' });
  };

  return CalendarEvent;
};
