const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { budgetCategoryTypeService } = require('../services');

const createBudgetCategoryType = catchAsync(async (req, res) => {
    try {
        let data = req.body;
        data.budgetCategoryTypeSlug = data.budgetCategoryTypeName.toLowerCase().replace(/\s/g, '');

    const budgetCategoryType = await budgetCategoryTypeService.createBudgetCategoryType(req.body);
    res.status(httpStatus.CREATED).send(budgetCategoryType);
  } catch (error) {
    throw error;
  }
});

const getAllBudgetCategoryType = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const budgetCategoryType = await budgetCategoryTypeService.getAllBudgetCategoryTypes(filter, options);
  res.status(httpStatus.OK).send(budgetCategoryType);
});

const getBudgetCategoryType = catchAsync(async (req, res) => {
  const budgetCategoryType = await budgetCategoryTypeService.getBudgetCategoryType(req.params.budgetCategoryId);
  if (!budgetCategoryType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Budget Category Type not found');
  }
  res.status(httpStatus.OK).send(budgetCategoryType);
});

const updateBudgetCategoryType = catchAsync(async (req, res) => {
  let data = req.body;
  data.budgetCategoryTypeSlug = data.budgetCategoryTypeName.toLowerCase().replace(/\s/g, '');
  const updatedBudgetCategoryType = await budgetCategoryTypeService.updateBudgetCategoryType(req.params.budgetCategoryTypeId, data);
  res.send(updatedBudgetCategoryType);
});

const deleteBudgetCategoryType = catchAsync(async (req, res) => {
  await budgetCategoryTypeService.deleteBudgetCategoryTypeId(req.params.budgetCategoryTypeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createBudgetCategoryType,
    getAllBudgetCategoryType,
    getBudgetCategoryType,
    updateBudgetCategoryType,
    deleteBudgetCategoryType,
};
