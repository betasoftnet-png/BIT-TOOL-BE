module.exports = (sequelize, DataTypes) => {
  const CalculatorTag = sequelize.define('CalculatorTag', {
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
    }
  }, {
    tableName: 'calculator_tags',
    timestamps: true,
    paranoid: true,
  });

  CalculatorTag.associate = (models) => {
    CalculatorTag.belongsToMany(models.CalculatorSession, {
      through: models.CalculatorSessionTag,
      foreignKey: 'tagId',
      otherKey: 'sessionId',
      as: 'sessions'
    });
  };

  return CalculatorTag;
};
