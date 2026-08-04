'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Calculator Categories
    await queryInterface.createTable('calculator_categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      color: {
        type: Sequelize.STRING(7),
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

    // 2. Calculator Tags
    await queryInterface.createTable('calculator_tags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // 3. Calculator Sessions
    await queryInterface.createTable('calculator_sessions', {
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
      title: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Untitled Session',
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'calculator_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      mode: {
        type: Sequelize.ENUM('normal', 'business', 'scientific', 'compare'),
        defaultValue: 'normal',
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'draft'),
        defaultValue: 'active',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isArchived: {
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

    // 4. Calculator Items (Tape)
    await queryInterface.createTable('calculator_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      sessionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'calculator_sessions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expression: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      operator: {
        type: Sequelize.STRING(5),
        allowNull: true,
      },
      value: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
      },
      runningTotal: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
      },
      remarks: {
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

    // 5. Calculator Session Tags (Many-to-Many)
    await queryInterface.createTable('calculator_session_tags', {
      sessionId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'calculator_sessions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tagId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'calculator_tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('calculator_session_tags');
    await queryInterface.dropTable('calculator_items');
    await queryInterface.dropTable('calculator_sessions');
    await queryInterface.dropTable('calculator_tags');
    await queryInterface.dropTable('calculator_categories');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_calculator_sessions_mode";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_calculator_sessions_status";');
  }
};
