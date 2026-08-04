module.exports = (sequelize, DataTypes) => {
  const ComparisonItem = sequelize.define('ComparisonItem', {
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
    vendorA_Value: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    vendorB_Value: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    difference: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    percentageDifference: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    winner: {
      type: DataTypes.ENUM('Vendor A', 'Vendor B', 'Tie', 'None'),
      defaultValue: 'None',
    }
  }, {
    tableName: 'comparison_items',
    timestamps: true,
    paranoid: true,
  });

  ComparisonItem.associate = (models) => {
    ComparisonItem.belongsTo(models.ComparisonSession, {
      foreignKey: 'sessionId',
      as: 'session'
    });
  };

  return ComparisonItem;
};
