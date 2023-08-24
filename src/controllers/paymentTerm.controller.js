const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentTermService} = require('../services');
const { paymentTerm } = require('../models');



const createPaymentTerm = catchAsync(async (req, res) =>  {
  milestone = req.body.milestone;
  delete req.body.milestone;
  const PaymentTerm = await paymentTermService.createPaymentTerm(req.body, milestone);
  res.status(httpStatus.CREATED).json(PaymentTerm);
});


const getPaymentTerms = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['payment_term']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentTermService.getPaymentTerms(filter, options);
  res.send(result);
});

const getPaymentTerm = catchAsync(async(req, res)=>{
  const paymentTerm = await paymentTermService.getPaymentTerm(req.params.paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment term not found');
  }
  res.send(paymentTerm);
});

const getByProject = catchAsync(async(req, res)=>{
  const projectPaymentTerm = await paymentTermService.getByProject(req.params.projectId);
  res.send(projectPaymentTerm);
});


const updatePaymentTerm = catchAsync(async(req, res)=>{
  const milestone = req.body.milestone;
  delete req.body.milestone;
  const paymentTerm = await paymentTermService.updatePaymentTerm(req.params.paymentTermId, req.body, milestone);
  res.send(paymentTerm);
});


const deletePaymentTerm = catchAsync(async(req, res)=>{
  await paymentTermService.deletePaymentTerm(req.params.paymentTermId);
  res.send("Payment Term Deleted");
});

module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
};
