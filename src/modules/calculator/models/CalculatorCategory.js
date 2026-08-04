module.exports = (sequelize, DataTypes) => {
  const CalculatorCategory = sequelize.define('CalculatorCategory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7), // hex color
      allowNull: true,
    }
  }, {
    tableName: 'calculator_categories',
    timestamps: true,
    paranoid: true,
  });

  CalculatorCategory.associate = (models) => {
    CalculatorCategory.hasMany(models.CalculatorSession, {
      foreignKey: 'categoryId',
      as: 'sessions'
    });
  };

  return CalculatorCategory;
};
