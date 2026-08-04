module.exports = (sequelize, DataTypes) => {
  const CalculatorSessionTag = sequelize.define('CalculatorSessionTag', {
    sessionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'calculator_sessions',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'calculator_tags',
        key: 'id'
      }
    }
  }, {
    tableName: 'calculator_session_tags',
    timestamps: false,
  });

  return CalculatorSessionTag;
};
