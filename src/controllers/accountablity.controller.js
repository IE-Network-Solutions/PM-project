const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { accountablityService } = require('../services');


const createAccountablity = catchAsync(async (req, res) => {
    const accountablities = await Promise.all(req.body?.accountablities?.map(async (element) => {
        const accountablity = await accountablityService.createAccountablity(element, req.body.afterActionAnalysisId);

        return accountablity;

    }));


    res.status(httpStatus.CREATED).send(accountablities);
});

const getAccountablities = catchAsync(async (req, res) => {
    const filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await accountablityService.queryAccountablities(filter, options);
    res.send(result);
});

const getAccountablityById = catchAsync(async (req, res) => {
    const action = await accountablityService.getAccountablityById(req.params.accId);
    if (!action) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Action not found');
    }
    res.send(action);
});

const updateAccountablityById = catchAsync(async (req, res) => {
    const action = await accountablityService.updateAccountablityById(req.params.accId, req.body);
    res.send(action);
});

const deleteAccountablityById = catchAsync(async (req, res) => {

    await accountablityService.deleteAccountablityById(req.params.accId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createAccountablity,
    getAccountablities,
    getAccountablityById,
    updateAccountablityById,
    deleteAccountablityById
};
