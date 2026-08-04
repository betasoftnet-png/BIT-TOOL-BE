module.exports = (sequelize, DataTypes) => {
  const ComparisonSession = sequelize.define('ComparisonSession', {
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
      allowNull: true,
      defaultValue: 'Untitled Comparison',
    },
    vendorA_Name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Vendor A',
    },
    vendorB_Name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Vendor B',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'comparison_sessions',
    timestamps: true,
    paranoid: true,
  });

  ComparisonSession.associate = (models) => {
    ComparisonSession.hasMany(models.ComparisonItem, {
      foreignKey: 'sessionId',
      as: 'items'
    });
  };

  return ComparisonSession;
};
