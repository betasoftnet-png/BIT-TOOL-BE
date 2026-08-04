module.exports = (sequelize, DataTypes) => {
  const TaxPreset = sequelize.define('TaxPreset', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(5, 2), // e.g., 18.00 for 18%
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('GST', 'VAT', 'TDS', 'OTHER'),
      defaultValue: 'OTHER',
    },
    countryCode: {
      type: DataTypes.STRING(2), // e.g., IN, US
      allowNull: true,
    }
  }, {
    tableName: 'tax_presets',
    timestamps: true,
    paranoid: true,
  });

  return TaxPreset;
};
