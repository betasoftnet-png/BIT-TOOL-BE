module.exports = (sequelize, DataTypes) => {
  const CalculatorShareLink = sequelize.define('CalculatorShareLink', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'calculator_share_links',
    timestamps: true,
    updatedAt: false, // Don't really need updatedAt for share tokens
  });

  CalculatorShareLink.associate = (models) => {
    CalculatorShareLink.belongsTo(models.CalculatorSession, {
      foreignKey: 'sessionId',
      as: 'session'
    });
  };

  return CalculatorShareLink;
};
