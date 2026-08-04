const { models } = require('../../../database/connection');

class AuditService {
  async log(userEmail, applicationName, action, oldValue = null, newValue = null) {
    try {
      await models.AuditLog.create({
        userEmail,
        applicationName,
        action,
        oldValue,
        newValue
      });
    } catch (error) {
      const logger = require('../../../shared/logger');
      logger.error('Failed to write audit log:', error);
      // We don't typically want an audit log failure to crash the main transaction,
      // but it should be heavily logged.
    }
  }
}

module.exports = new AuditService();
