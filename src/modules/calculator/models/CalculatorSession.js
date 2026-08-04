module.exports = (sequelize, DataTypes) => {
  const CalculatorSession = sequelize.define('CalculatorSession', {
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
      defaultValue: 'Untitled Session',
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    mode: {
      type: DataTypes.ENUM('normal', 'business', 'scientific', 'compare'),
      defaultValue: 'normal',
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'draft'),
      defaultValue: 'active',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'calculator_sessions',
    timestamps: true,
    paranoid: true,
  });

  CalculatorSession.associate = (models) => {
    CalculatorSession.hasMany(models.CalculatorItem, {
      foreignKey: 'sessionId',
      as: 'items'
    });
    CalculatorSession.belongsTo(models.CalculatorCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    CalculatorSession.belongsToMany(models.CalculatorTag, {
      through: models.CalculatorSessionTag,
      foreignKey: 'sessionId',
      otherKey: 'tagId',
      as: 'tags'
    });
  };

  return CalculatorSession;
};
