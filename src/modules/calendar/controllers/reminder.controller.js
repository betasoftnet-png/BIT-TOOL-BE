const reminderService = require('../services/reminder.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createReminder = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminder = await reminderService.createReminder(email, appName, req.body);
    return ApiResponse.success(res, reminder, 'Reminder created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getReminder = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminder = await reminderService.getReminder(req.params.id, email, appName);
    return ApiResponse.success(res, reminder, 'Reminder retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getRemindersByDate = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const { date } = req.query; // YYYY-MM-DD
    const reminders = await reminderService.getRemindersByDate(date, email, appName);
    return ApiResponse.success(res, reminders, 'Reminders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getUpcomingReminders = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminders = await reminderService.getUpcomingReminders(email, appName);
    return ApiResponse.success(res, reminders, 'Upcoming reminders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getPendingReminders = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminders = await reminderService.getRemindersByStatus('pending', email, appName);
    return ApiResponse.success(res, reminders, 'Pending reminders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCompletedReminders = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminders = await reminderService.getRemindersByStatus('completed', email, appName);
    return ApiResponse.success(res, reminders, 'Completed reminders retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateReminder = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminder = await reminderService.updateReminder(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, reminder, 'Reminder updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.markReminderCompleted = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const reminder = await reminderService.markAsCompleted(req.params.id, email, appName);
    return ApiResponse.success(res, reminder, 'Reminder marked as completed');
  } catch (error) {
    next(error);
  }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await reminderService.deleteReminder(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Reminder deleted successfully');
  } catch (error) {
    next(error);
  }
};
