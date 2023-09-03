const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { currencyService} = require('../services');




const getCurrencies = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const currency = await currencyService.queryCurrency(filter, options)
  res.send(currency);
});



module.exports = {
  getCurrencies,
};
