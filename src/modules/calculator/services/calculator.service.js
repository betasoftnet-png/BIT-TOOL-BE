const sessionRepository = require('../repositories/session.repository');
const itemRepository = require('../repositories/item.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('../../../database/connection');

class CalculatorService {
  
  // ======================
  // SESSION MANAGEMENT
  // ======================
  
  async createSession(userEmail, applicationName, data) {
    return await sessionRepository.create({
      ...data,
      userEmail,
      applicationName
    });
  }

  async getSessionById(sessionId, userEmail, applicationName) {
    const session = await sessionRepository.findById(sessionId);
    if (!session) {
      throw new AppError('Session not found', StatusCodes.NOT_FOUND);
    }
    
    // Authorization check
    if (session.userEmail !== userEmail || session.applicationName !== applicationName) {
      throw new AppError('Unauthorized access to this session', StatusCodes.FORBIDDEN);
    }

    return session;
  }

  async getHistory(userEmail, applicationName, query) {
    return await sessionRepository.findByUserAndApp(userEmail, applicationName, query);
  }

  async updateSession(sessionId, userEmail, applicationName, data) {
    await this.getSessionById(sessionId, userEmail, applicationName); // Auth check
    return await sessionRepository.update(sessionId, data);
  }

  async deleteSession(sessionId, userEmail, applicationName) {
    await this.getSessionById(sessionId, userEmail, applicationName); // Auth check
    return await sessionRepository.delete(sessionId);
  }

  // ======================
  // TAPE ITEM MANAGEMENT
  // ======================

  async addItem(sessionId, userEmail, applicationName, data) {
    await this.getSessionById(sessionId, userEmail, applicationName); // Auth check
    
    // Ideally, we'd wrap this in a transaction if we were doing auto-calculation on insertion in the middle
    // For now, we assume frontend provides the exact runningTotal for the new item at the end of tape.
    return await itemRepository.create({
      ...data,
      sessionId
    });
  }

  async updateItem(itemId, sessionId, userEmail, applicationName, data) {
    await this.getSessionById(sessionId, userEmail, applicationName); // Auth check
    
    const transaction = await sequelize.transaction();
    
    try {
      const item = await itemRepository.findById(itemId);
      if (!item || item.sessionId !== sessionId) {
        throw new AppError('Item not found', StatusCodes.NOT_FOUND);
      }

      // Update the specific item
      await itemRepository.update(itemId, data, transaction);

      // If value or operator changed, we must trigger recalculation
      if (data.value !== undefined || data.operator !== undefined) {
        await this.recalculateSubsequentItems(sessionId, item.sequence, transaction);
      }

      await transaction.commit();
      
      // Return the updated session with full tape
      return await sessionRepository.findById(sessionId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteItem(itemId, sessionId, userEmail, applicationName) {
    await this.getSessionById(sessionId, userEmail, applicationName); // Auth check
    
    const transaction = await sequelize.transaction();
    
    try {
      const item = await itemRepository.findById(itemId);
      if (!item || item.sessionId !== sessionId) {
        throw new AppError('Item not found', StatusCodes.NOT_FOUND);
      }

      await itemRepository.delete(itemId, transaction);
      
      // Sequence needs to be adjusted and values recalculated
      // For a robust system, we would shift sequences and recalculate.
      await this.recalculateSubsequentItems(sessionId, item.sequence - 1, transaction);

      await transaction.commit();
      return await sessionRepository.findById(sessionId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ======================
  // BUSINESS LOGIC ENGINE
  // ======================

  async recalculateSubsequentItems(sessionId, startSequence, transaction) {
    const allItems = await itemRepository.findBySessionId(sessionId, transaction);
    
    if (!allItems || allItems.length === 0) return;

    let currentTotal = 0;
    const itemsToUpdate = [];

    // Identify the starting total
    const startIdx = allItems.findIndex(i => i.sequence === startSequence);
    
    if (startIdx >= 0) {
      currentTotal = parseFloat(allItems[startIdx].runningTotal);
    }
    
    // Start recalculating from the next item
    const startIndexForCalc = startIdx >= 0 ? startIdx + 1 : 0;

    for (let i = startIndexForCalc; i < allItems.length; i++) {
      const item = allItems[i];
      const val = parseFloat(item.value);
      
      // Basic business logic for calculation based on operator
      switch (item.operator) {
        case '+':
          currentTotal += val;
          break;
        case '-':
          currentTotal -= val;
          break;
        case '*':
          currentTotal *= val;
          break;
        case '/':
          if (val !== 0) currentTotal /= val;
          break;
        case '%':
          currentTotal = currentTotal * (val / 100);
          break;
        default:
          // If no operator or unknown, assume assignment or new calculation block
          currentTotal = val;
      }
      
      // Update item logic
      item.runningTotal = currentTotal;
      itemsToUpdate.push(item);
    }

    if (itemsToUpdate.length > 0) {
      await itemRepository.bulkUpdate(itemsToUpdate, transaction);
    }
  }

  // ======================
  // ADVANCED BUSINESS LOGIC
  // ======================

  async applyBusinessLogic(sessionId, userEmail, applicationName, data) {
    const session = await this.getSessionById(sessionId, userEmail, applicationName);
    const BusinessLogicUtil = require('../utils/business-logic.util');
    
    let result;
    const { operation, value, parameter, label } = data;

    switch (operation) {
      case 'gst_inclusive':
        result = BusinessLogicUtil.applyGSTInclusive(value, parameter);
        break;
      case 'gst_exclusive':
        result = BusinessLogicUtil.applyGSTExclusive(value, parameter);
        break;
      case 'markup':
        result = BusinessLogicUtil.applyMarkup(value, parameter);
        break;
      case 'margin':
        result = BusinessLogicUtil.applyMargin(value, parameter);
        break;
      case 'discount':
        result = BusinessLogicUtil.applyDiscount(value, parameter);
        break;
      default:
        throw new AppError('Invalid business operation', StatusCodes.BAD_REQUEST);
    }

    // Determine the next sequence
    const items = session.items || [];
    const nextSequence = items.length > 0 ? items[items.length - 1].sequence + 1 : 1;
    
    // Add the new item representing this business logic result
    const newItem = await this.addItem(sessionId, userEmail, applicationName, {
      sequence: nextSequence,
      label: label || `Applied ${operation}`,
      value: result.finalValue || result.sellingPrice,
      operator: '=',
      runningTotal: result.finalValue || result.sellingPrice,
      remarks: JSON.stringify(result)
    });

    return await sessionRepository.findById(sessionId);
  }

  // ======================
  // ARCHIVE & TAGS
  // ======================

  async toggleArchive(sessionId, userEmail, applicationName, isArchived) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    return await sessionRepository.update(sessionId, { isArchived });
  }

  async createTag(userEmail, name) {
    const { models } = require('../../../database/connection');
    return await models.CalculatorTag.create({ userEmail, name });
  }

  async assignTag(sessionId, tagId, userEmail, applicationName) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    const { models } = require('../../../database/connection');
    
    const tag = await models.CalculatorTag.findOne({ where: { id: tagId, userEmail } });
    if (!tag) throw new AppError('Tag not found', StatusCodes.NOT_FOUND);

    await models.CalculatorSessionTag.findOrCreate({
      where: { sessionId, tagId }
    });

    return await sessionRepository.findById(sessionId);
  }

  // ======================
  // SHARE & EXPORT
  // ======================

  async generateShareLink(sessionId, userEmail, applicationName, expiresInDays = 7) {
    await this.getSessionById(sessionId, userEmail, applicationName);
    const { models } = require('../../../database/connection');
    const crypto = require('crypto');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const shareLink = await models.CalculatorShareLink.create({
      sessionId,
      token,
      expiresAt,
      createdBy: userEmail
    });

    // In a real app, you would return the full URL here (e.g. https://cliks.com/share/token)
    return {
      token: shareLink.token,
      expiresAt: shareLink.expiresAt,
      url: `/share/${shareLink.token}`
    };
  }

  async getSharedSession(token) {
    const { models } = require('../../../database/connection');
    
    const shareLink = await models.CalculatorShareLink.findOne({
      where: { token, isRevoked: false }
    });

    if (!shareLink) {
      throw new AppError('Invalid or revoked share link', StatusCodes.NOT_FOUND);
    }

    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      throw new AppError('Share link has expired', StatusCodes.GONE);
    }

    const session = await sessionRepository.findById(shareLink.sessionId);
    if (!session) throw new AppError('Session no longer exists', StatusCodes.NOT_FOUND);

    return session; // Usually, this is returned as read-only on the frontend
  }

  async exportSession(sessionId, userEmail, applicationName, format) {
    const session = await this.getSessionById(sessionId, userEmail, applicationName);
    
    // Architecturally, this is where you would dispatch to a specific generator strategy:
    // e.g. const generator = ExportFactory.getGenerator(format);
    // return await generator.generate(session);
    
    const auditService = require('../../common/services/audit.service');
    await auditService.log(userEmail, applicationName, `EXPORT_${format.toUpperCase()}`, null, { sessionId });

    return {
      message: `Export architecture is ready. Simulating ${format.toUpperCase()} generation.`,
      format,
      downloadUrl: `/downloads/simulated_${sessionId}.${format === 'excel' ? 'xlsx' : 'pdf'}`
    };
  }
}

module.exports = new CalculatorService();
