'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Comparison Sessions
    await queryInterface.createTable('comparison_sessions', {
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
        defaultValue: 'Untitled Comparison',
      },
      vendorA_Name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Vendor A',
      },
      vendorB_Name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Vendor B',
      },
      currency: {
        type: Sequelize.STRING(3),
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

    // 2. Comparison Items
    await queryInterface.createTable('comparison_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      sessionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'comparison_sessions',
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
      vendorA_Value: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
      },
      vendorB_Value: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
      },
      difference: {
        type: Sequelize.DECIMAL(15, 4),
        allowNull: false,
        defaultValue: 0,
      },
      percentageDifference: {
        type: Sequelize.DECIMAL(10, 2), // Adjusted to 10,2 for larger percentages
        allowNull: false,
        defaultValue: 0,
      },
      winner: {
        type: Sequelize.ENUM('Vendor A', 'Vendor B', 'Tie', 'None'),
        defaultValue: 'None',
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
    await queryInterface.dropTable('comparison_items');
    await queryInterface.dropTable('comparison_sessions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_comparison_items_winner";');
  }
};
