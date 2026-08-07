module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
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
    externalId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'contacts',
    timestamps: true,
    paranoid: true, // Enables soft deletes (deletedAt)
  });

  return Contact;
};
