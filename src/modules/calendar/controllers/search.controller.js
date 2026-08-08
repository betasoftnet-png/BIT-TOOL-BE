const searchService = require('../services/search.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');

exports.search = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const results = await searchService.unifiedSearch(email, appName, req.query);
    return ApiResponse.success(res, results, 'Search results retrieved successfully');
  } catch (error) {
    next(error);
  }
};
