const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const path = require('path');
const { validateFile } = require('../validations/upload.validation');
const { paymentTermService } = require('../services');
const { paymentTerm } = require('../models');
/**
 * @module paymentTerm
 */
/**
 * Creates payment terms.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the created payment terms.
 */
const createPaymentTerm = catchAsync(async (req, res) => {
  const PaymntTerms = await Promise.all(
    req.body.map(async (singelPaymentTerm) => {
      milestone = singelPaymentTerm.milestone;
      delete singelPaymentTerm.milestone;
      const PaymentTerm = await paymentTermService.createPaymentTerm(singelPaymentTerm, milestone);
      return PaymentTerm;
    })
  );

  res.status(httpStatus.CREATED).json(PaymntTerms);
});
/**
 * Retrieves payment terms based on the provided filter and options.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the retrieved payment terms.
 */
const getPaymentTerms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['payment_term']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentTermService.getPaymentTerms(filter, options);
  res.send(result);
});
/**
 * Retrieves a payment term by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the payment term corresponding to the provided ID.
 * @throws {ApiError} If the payment term with the provided ID is not found.
 */
const getPaymentTerm = catchAsync(async (req, res) => {
  const paymentTerm = await paymentTermService.getPaymentTerm(req.params.paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment term not found');
  }
  res.send(paymentTerm);
});
/**
 * Retrieves payment terms by project ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the payment terms associated with the provided project ID.
 */
const getByProject = catchAsync(async (req, res) => {
  const projectPaymentTerm = await paymentTermService.getByProject(req.params.projectId);
  res.send(projectPaymentTerm);
});
/**
 * Updates a payment term by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the updated payment term.
 */
const updatePaymentTerm = catchAsync(async (req, res) => {
  const path = req.file ? req.file.path : null;
  req.body.path = path;
  const milestone = req.body.milestone;
  delete req.body.milestone;
  const paymentTerm = await paymentTermService.updatePaymentTerm(req.params.paymentTermId, req.body, milestone);
  res.send(paymentTerm);
});
/**
 * Deletes a payment term by its ID.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves after deleting the payment term.
 */
const deletePaymentTerm = catchAsync(async (req, res) => {
  await paymentTermService.deletePaymentTerm(req.params.paymentTermId);
  res.send('Payment Term Deleted');
});
/**
 * Sets variance for payment terms based on the provided variance data.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A Promise that resolves with the calculated variance value.
 */
const setVariance = catchAsync(async (req, res) => {
  varianceValue = await paymentTermService.setVariance(req.body.varianceData);
  res.send(varianceValue);
});
module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
  setVariance,
};
