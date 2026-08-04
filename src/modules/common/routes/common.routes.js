const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.controller');
const requireAuth = require('../../../shared/authentication/jwt.middleware');

// All common routes require authentication
router.use(requireAuth);

router.get('/tax-presets', commonController.getTaxPresets);
router.get('/currencies', commonController.getCurrencies);
router.get('/exchange-rates', commonController.getExchangeRates);

module.exports = router;
