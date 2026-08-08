const eventService = require('../services/event.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createEvent = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const event = await eventService.createEvent(email, appName, req.body);
    return ApiResponse.success(res, event, 'Event created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const event = await eventService.getEvent(req.params.id, email, appName);
    return ApiResponse.success(res, event, 'Event retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getEventsByDate = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { date } = req.query; // YYYY-MM-DD
    const events = await eventService.getEventsByDate(date, email, appName);
    return ApiResponse.success(res, events, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getEventsByMonth = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { year, month } = req.query; 
    const events = await eventService.getEventsByMonth(year, month, email, appName);
    return ApiResponse.success(res, events, 'Events retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const event = await eventService.updateEvent(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, event, 'Event updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await eventService.deleteEvent(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Event deleted successfully');
  } catch (error) {
    next(error);
  }
};
