'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create Calendar Categories
    await queryInterface.createTable('calendar_categories', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userEmail: { type: Sequelize.STRING, allowNull: false },
      applicationName: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: true, defaultValue: '#3B82F6' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 2. Create Calendar Events
    await queryInterface.createTable('calendar_events', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userEmail: { type: Sequelize.STRING, allowNull: false },
      applicationName: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      startTime: { type: Sequelize.DATE, allowNull: false },
      endTime: { type: Sequelize.DATE, allowNull: false },
      location: { type: Sequelize.STRING, allowNull: true },
      color: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.STRING, allowNull: true, defaultValue: 'scheduled' },
      categoryId: { 
        type: Sequelize.UUID, 
        allowNull: true,
        references: { model: 'calendar_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 3. Create Calendar Notes
    await queryInterface.createTable('calendar_notes', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userEmail: { type: Sequelize.STRING, allowNull: false },
      applicationName: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: true },
      date: { type: Sequelize.DATE, allowNull: false },
      categoryId: { 
        type: Sequelize.UUID, 
        allowNull: true,
        references: { model: 'calendar_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // 4. Create Calendar Reminders
    await queryInterface.createTable('calendar_reminders', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      userEmail: { type: Sequelize.STRING, allowNull: false },
      applicationName: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      date: { type: Sequelize.DATE, allowNull: false },
      time: { type: Sequelize.STRING, allowNull: true },
      repeatType: { type: Sequelize.STRING, allowNull: false, defaultValue: 'none' },
      notificationType: { type: Sequelize.STRING, allowNull: true, defaultValue: 'email' },
      notificationEmail: { type: Sequelize.STRING, allowNull: true },
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'pending' },
      categoryId: { 
        type: Sequelize.UUID, 
        allowNull: true,
        references: { model: 'calendar_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });

    // Add Tenancy Indexes
    await queryInterface.addIndex('calendar_categories', ['userEmail', 'applicationName']);
    await queryInterface.addIndex('calendar_events', ['userEmail', 'applicationName']);
    await queryInterface.addIndex('calendar_notes', ['userEmail', 'applicationName']);
    await queryInterface.addIndex('calendar_reminders', ['userEmail', 'applicationName']);
    
    // Add Query Indexes
    await queryInterface.addIndex('calendar_events', ['startTime', 'endTime']);
    await queryInterface.addIndex('calendar_notes', ['date']);
    await queryInterface.addIndex('calendar_reminders', ['date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('calendar_reminders');
    await queryInterface.dropTable('calendar_notes');
    await queryInterface.dropTable('calendar_events');
    await queryInterface.dropTable('calendar_categories');
  }
};
