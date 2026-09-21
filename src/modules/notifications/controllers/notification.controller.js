const { models } = require('../../../database/connection');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const AppError = require('../../../shared/exceptions/AppError');
const { StatusCodes } = require('http-status-codes');

exports.getNotifications = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const applicationName = req.user.appName || 'Bit Tool';
    const { allApps } = req.query;
    
    const whereClause = { userEmail };
    if (allApps !== 'true') {
      whereClause.applicationName = applicationName;
    }
    
    const notifications = await models.Notification.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    return ApiResponse.success(res, notifications, 'Notifications retrieved successfully');
  } catch (error) {
    next(new AppError('Failed to fetch notifications', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;

    const notification = await models.Notification.findOne({ where: { id, userEmail } });
    
    if (!notification) {
      return next(new AppError('Notification not found', StatusCodes.NOT_FOUND));
    }

    notification.isRead = true;
    await notification.save();

    return ApiResponse.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(new AppError('Failed to mark notification as read', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const userEmail = req.user.email;

    await models.Notification.update(
      { isRead: true },
      { where: { userEmail, isRead: false } }
    );

    return ApiResponse.success(res, null, 'All notifications marked as read');
  } catch (error) {
    next(new AppError('Failed to mark all notifications as read', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
