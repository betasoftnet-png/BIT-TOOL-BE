const { models } = require('../../../database/connection');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class CompareService {
  
  async createSession(userEmail, applicationName, data) {
    return await models.ComparisonSession.create({
      ...data,
      userEmail,
      applicationName
    });
  }

  async getSessionById(sessionId, userEmail, applicationName) {
    const session = await models.ComparisonSession.findByPk(sessionId, {
      include: [
        { model: models.ComparisonItem, as: 'items' }
      ],
      order: [[{ model: models.ComparisonItem, as: 'items' }, 'sequence', 'ASC']]
    });

    if (!session) {
      throw new AppError('Comparison Session not found', StatusCodes.NOT_FOUND);
    }
    
    if (session.userEmail !== userEmail || session.applicationName !== applicationName) {
      throw new AppError('Unauthorized access to this session', StatusCodes.FORBIDDEN);
    }

    return session;
  }

  async getHistory(userEmail, applicationName, query) {
    const { limit = 10, offset = 0, isArchived = false } = query;
    return await models.ComparisonSession.findAndCountAll({
      where: { userEmail, applicationName, isArchived },
      limit,
      offset,
      order: [['updatedAt', 'DESC']]
    });
  }

  async updateSession(sessionId, userEmail, applicationName, data) {
    const session = await this.getSessionById(sessionId, userEmail, applicationName);
    return await session.update(data);
  }

  async deleteSession(sessionId, userEmail, applicationName) {
    const session = await this.getSessionById(sessionId, userEmail, applicationName);
    await session.destroy();
    return true;
  }

  // ======================
  // ITEMS LOGIC
  // ======================

  _calculateItemStats(vendorA_Value, vendorB_Value) {
    const valA = parseFloat(vendorA_Value || 0);
    const valB = parseFloat(vendorB_Value || 0);
    
    // Default logic: lower is better (e.g. costs). 
    // If the frontend wants higher is better, they can interpret the difference themselves,
    // but we will calculate absolute difference and standard winner logic.
    const difference = Math.abs(valA - valB);
    
    let percentageDifference = 0;
    if (valA !== 0) {
      percentageDifference = ((valB - valA) / valA) * 100;
    }

    let winner = 'Tie';
    if (valA < valB) winner = 'Vendor A'; // Assuming lower cost = winner
    else if (valB < valA) winner = 'Vendor B';

    // If both 0, None
    if (valA === 0 && valB === 0) winner = 'None';

    return { difference, percentageDifference, winner };
  }

  async addItem(sessionId, userEmail, applicationName, data) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    
    const stats = this._calculateItemStats(data.vendorA_Value, data.vendorB_Value);
    
    return await models.ComparisonItem.create({
      ...data,
      sessionId,
      ...stats
    });
  }

  async updateItem(itemId, sessionId, userEmail, applicationName, data) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    
    const item = await models.ComparisonItem.findByPk(itemId);
    if (!item || item.sessionId !== sessionId) {
      throw new AppError('Item not found', StatusCodes.NOT_FOUND);
    }

    const valA = data.vendorA_Value !== undefined ? data.vendorA_Value : item.vendorA_Value;
    const valB = data.vendorB_Value !== undefined ? data.vendorB_Value : item.vendorB_Value;
    
    const stats = this._calculateItemStats(valA, valB);
    
    await item.update({ ...data, ...stats });
    
    return await this.getSessionById(sessionId, userEmail, applicationName);
  }

  async deleteItem(itemId, sessionId, userEmail, applicationName) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    
    const item = await models.ComparisonItem.findByPk(itemId);
    if (!item || item.sessionId !== sessionId) {
      throw new AppError('Item not found', StatusCodes.NOT_FOUND);
    }

    await item.destroy();
    return await this.getSessionById(sessionId, userEmail, applicationName);
  }
}

module.exports = new CompareService();
