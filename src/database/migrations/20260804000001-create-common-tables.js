'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Applications
    await queryInterface.createTable('applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });

    // 2. Audit Logs
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      applicationName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      oldValue: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      newValue: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // 3. Currencies
    await queryInterface.createTable('currencies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });

    // 4. Exchange Rates
    await queryInterface.createTable('exchange_rates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fromCurrency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      toCurrency: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      isManual: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });

    // 5. Tax Presets
    await queryInterface.createTable('tax_presets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('GST', 'VAT', 'TDS', 'OTHER'),
        defaultValue: 'OTHER',
      },
      countryCode: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tax_presets');
    await queryInterface.dropTable('exchange_rates');
    await queryInterface.dropTable('currencies');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('applications');
    
    // Drop ENUMs if Postgres complains
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_applications_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tax_presets_type";');
  }
};
