const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config');
const logger = require('../shared/logger');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const models = {};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Dynamically load models
    const modulesPath = path.join(__dirname, '../modules');
    const modules = fs.readdirSync(modulesPath);
    
    for (const mod of modules) {
      const modelsDir = path.join(modulesPath, mod, 'models');
      if (fs.existsSync(modelsDir)) {
        const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));
        for (const file of modelFiles) {
          const modelDefiner = require(path.join(modelsDir, file));
          const model = modelDefiner(sequelize, DataTypes);
          models[model.name] = model;
        }
      }
    }

    // Call associate functions if they exist
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
    
    logger.info('Models loaded and associated successfully.');

    // Auto-sync database in development mode
    if (config.env === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database schema synced successfully.');
    }
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
  models
};
