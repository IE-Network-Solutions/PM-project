const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const path = require('path');
const { validateFile } = require('../validations/upload.validation');
const { paymentTermService } = require('../services');
const { paymentTerm } = require('../models');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './../public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Use the validateFile function from Joi to perform file validation
  const isValid = validateFile(file);
  if (isValid) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with an error message
    cb(new Error('Invalid file'), false);
  }
};
let upload = multer({ storage: storage , fileFilter: fileFilter});

const createPaymentTerm = catchAsync(async (req, res) => {
  const PaymntTerms = await Promise.all(
    req.body.map(async (singelPaymentTerm) => {
      milestone = singelPaymentTerm.milestone;
      delete singelPaymentTerm.milestone;
      console.log('mile', milestone);
      console.log('body', req.body);
      const PaymentTerm = await paymentTermService.createPaymentTerm(singelPaymentTerm, milestone);
      return PaymentTerm;
    })
  );

  res.status(httpStatus.CREATED).json(PaymntTerms);
});

const getPaymentTerms = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['payment_term']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentTermService.getPaymentTerms(filter, options);
  res.send(result);
});

const getPaymentTerm = catchAsync(async (req, res) => {
  const paymentTerm = await paymentTermService.getPaymentTerm(req.params.paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment term not found');
  }
  res.send(paymentTerm);
});

const getByProject = catchAsync(async (req, res) => {
  const projectPaymentTerm = await paymentTermService.getByProject(req.params.projectId);
  res.send(projectPaymentTerm);
});

const updatePaymentTerm = catchAsync(async (req, res) => {
  const uploadATP = upload(req.body.file);
  req.body.path = uploadATP;
  const milestone = req.body.milestone;
  delete req.body.milestone;
  const paymentTerm = await paymentTermService.updatePaymentTerm(req.params.paymentTermId, req.body, milestone);
  res.send(paymentTerm);
});

const deletePaymentTerm = catchAsync(async (req, res) => {
  await paymentTermService.deletePaymentTerm(req.params.paymentTermId);
  res.send('Payment Term Deleted');
});

module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
};
