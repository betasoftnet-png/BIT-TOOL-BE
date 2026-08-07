const contactService = require('../services/contact.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { StatusCodes } = require('http-status-codes');

exports.createContact = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const contact = await contactService.createContact(email, appName, req.body);
    return ApiResponse.success(res, contact, 'Contact created successfully', StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

exports.getContacts = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const contacts = await contactService.getContacts(email, appName, req.query);
    return ApiResponse.success(res, contacts, 'Contacts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const { email } = req.user;
    const contacts = await contactService.getAllContacts(email, req.query);
    return ApiResponse.success(res, contacts, 'All contacts across applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.getContact = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const contact = await contactService.getContactById(req.params.id, email, appName);
    return ApiResponse.success(res, contact, 'Contact retrieved successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateContact = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    const contact = await contactService.updateContact(req.params.id, email, appName, req.body);
    return ApiResponse.success(res, contact, 'Contact updated successfully');
  } catch (error) {
    next(error);
  }
};

exports.updateExternalContact = async (req, res, next) => {
  try {
    const { email } = req.user;
    // We omit appName here because we are finding by externalId and userEmail
    const contact = await contactService.updateExternalContact(req.params.externalId, email, req.body);
    return ApiResponse.success(res, contact, 'Contact updated successfully via external ID');
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const { email, appName } = req.user;
    await contactService.deleteContact(req.params.id, email, appName);
    return ApiResponse.success(res, null, 'Contact deleted successfully');
  } catch (error) {
    next(error);
  }
};
