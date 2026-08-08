const eventRepo = require('../repositories/event.repository');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

class EventService {
  async createEvent(userEmail, applicationName, data) {
    if (new Date(data.startTime) >= new Date(data.endTime)) {
      throw new AppError('End time must be after start time', StatusCodes.BAD_REQUEST);
    }
    return await eventRepo.create({ ...data, userEmail, applicationName });
  }

  async getEvent(id, userEmail, applicationName) {
    const event = await eventRepo.findById(id, userEmail, applicationName);
    if (!event) throw new AppError('Event not found', StatusCodes.NOT_FOUND);
    return event;
  }

  async getEventsByDate(date, userEmail, applicationName) {
    return await eventRepo.findByDate(date, userEmail, applicationName);
  }

  async getEventsByMonth(year, month, userEmail, applicationName) {
    return await eventRepo.findByMonth(year, month, userEmail, applicationName);
  }

  async updateEvent(id, userEmail, applicationName, data) {
    if (data.startTime && data.endTime && new Date(data.startTime) >= new Date(data.endTime)) {
      throw new AppError('End time must be after start time', StatusCodes.BAD_REQUEST);
    }
    const updated = await eventRepo.update(id, userEmail, applicationName, data);
    if (!updated) throw new AppError('Event not found', StatusCodes.NOT_FOUND);
    return updated;
  }

  async deleteEvent(id, userEmail, applicationName) {
    const deleted = await eventRepo.delete(id, userEmail, applicationName);
    if (!deleted) throw new AppError('Event not found', StatusCodes.NOT_FOUND);
    return true;
  }
}

module.exports = new EventService();
