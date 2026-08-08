'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('calendar_reminders', 'notificationId', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('calendar_reminders', 'notificationScheduledAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    await queryInterface.addColumn('calendar_reminders', 'notificationStatus', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending' // pending, scheduled, cancelled, failed, sent
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('calendar_reminders', 'notificationStatus');
    await queryInterface.removeColumn('calendar_reminders', 'notificationScheduledAt');
    await queryInterface.removeColumn('calendar_reminders', 'notificationId');
  }
};
