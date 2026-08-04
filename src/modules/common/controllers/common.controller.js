const { models } = require('../../../database/connection');
const ApiResponse = require('../../../shared/responses/ApiResponse');

exports.getTaxPresets = async (req, res, next) => {
  try {
    const taxPresets = await models.TaxPreset.findAll();
    return ApiResponse.success(res, taxPresets, 'Tax presets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCurrencies = async (req, res, next) => {
  try {
    const currencies = await models.Currency.findAll();
    return ApiResponse.success(res, currencies, 'Currencies retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getExchangeRates = async (req, res, next) => {
  try {
    const exchangeRates = await models.ExchangeRate.findAll();
    return ApiResponse.success(res, exchangeRates, 'Exchange rates retrieved successfully');
  } catch (error) {
    next(error);
  }
};
