const compareRepository = require('../repositories/compare.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class CompareService {
  async getHistory(userEmail, applicationName) {
    return await compareRepository.findSessionsByUserAndApp(userEmail, applicationName);
  }

  async deleteAllHistory(userEmail, applicationName) {
    return await compareRepository.deleteSessionsByUserAndApp(userEmail, applicationName);
  }

  async getSession(sessionId, userEmail, applicationName) {
    const session = await compareRepository.findSessionById(sessionId);
    if (!session) {
      throw new AppError('Comparison session not found', StatusCodes.NOT_FOUND);
    }
    if (session.userEmail !== userEmail || session.applicationName !== applicationName) {
      throw new AppError('Unauthorized access to this session', StatusCodes.FORBIDDEN);
    }
    return session;
  }

  async createSession(userEmail, applicationName, data) {
    return await compareRepository.createSession({
      ...data,
      userEmail,
      applicationName
    });
  }

  async addItem(sessionId, userEmail, applicationName, data) {
    await this.getSession(sessionId, userEmail, applicationName); // Auth check
    
    // Determine difference and winner
    const valA = parseFloat(data.vendorA_Value || 0);
    const valB = parseFloat(data.vendorB_Value || 0);
    const difference = Math.abs(valA - valB);
    const percentageDifference = valA > 0 ? (difference / valA) * 100 : 0;
    
    let winner = 'None';
    if (valA > valB) winner = 'Vendor A';
    else if (valB > valA) winner = 'Vendor B';
    else if (valA === valB && valA !== 0) winner = 'Tie';

    return await compareRepository.addItem({
      ...data,
      sessionId,
      difference,
      percentageDifference,
      winner
    });
  }

  async updateItem(itemId, sessionId, userEmail, applicationName, data) {
    await this.getSession(sessionId, userEmail, applicationName); // Auth check
    
    const valA = parseFloat(data.vendorA_Value !== undefined ? data.vendorA_Value : 0);
    const valB = parseFloat(data.vendorB_Value !== undefined ? data.vendorB_Value : 0);
    const difference = Math.abs(valA - valB);
    const percentageDifference = valA > 0 ? (difference / valA) * 100 : 0;
    
    let winner = 'None';
    if (valA > valB) winner = 'Vendor A';
    else if (valB > valA) winner = 'Vendor B';
    else if (valA === valB && valA !== 0) winner = 'Tie';

    const item = await compareRepository.updateItem(itemId, {
      ...data,
      difference,
      percentageDifference,
      winner
    });

    if (!item) {
      throw new AppError('Item not found', StatusCodes.NOT_FOUND);
    }

    return await this.getSession(sessionId, userEmail, applicationName); // Return updated session
  }

  async deleteItem(itemId, sessionId, userEmail, applicationName) {
    await this.getSession(sessionId, userEmail, applicationName); // Auth check
    const deleted = await compareRepository.deleteItem(itemId);
    if (!deleted) {
      throw new AppError('Item not found', StatusCodes.NOT_FOUND);
    }
    return await this.getSession(sessionId, userEmail, applicationName); // Return updated session
  }

  async updateSession(sessionId, userEmail, applicationName, data) {
    const session = await this.getSession(sessionId, userEmail, applicationName);
    return await session.update(data);
  }

  async deleteSession(sessionId, userEmail, applicationName) {
    const session = await this.getSession(sessionId, userEmail, applicationName);
    await session.destroy();
    return true;
  }
}

module.exports = new CompareService();
