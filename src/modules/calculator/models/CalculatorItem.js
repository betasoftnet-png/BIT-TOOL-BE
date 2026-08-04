module.exports = (sequelize, DataTypes) => {
  const CalculatorItem = sequelize.define('CalculatorItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expression: {
      type: DataTypes.STRING,
      allowNull: true, // e.g. "50 + 20"
    },
    operator: {
      type: DataTypes.STRING(5),
      allowNull: true, // e.g. "+", "-", "*", "/"
    },
    value: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    runningTotal: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'calculator_items',
    timestamps: true,
    paranoid: true,
  });

  CalculatorItem.associate = (models) => {
    CalculatorItem.belongsTo(models.CalculatorSession, {
      foreignKey: 'sessionId',
      as: 'session'
    });
  };

  return CalculatorItem;
};
