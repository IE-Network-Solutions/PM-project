const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { baselineService} = require('../services');

const createBaseline = catchAsync(async (req, res) => {
  const Tasks = req.body.tasks;
  const subTasks = req.body.subTasks;
  delete req.body.Tasks;
  delete req.body.subTasks; 
  const baseline = await baselineService.createBaseline(req.body, Tasks, subTasks);
  res.status(httpStatus.CREATED).json(baseline);
});



const getBaselines = catchAsync(async(req, res)=>{
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const baseline = await baselineService.getBaselines(filter, options);
  res.send(baseline);
});

const getBaseline = catchAsync(async(req, res)=>{
  const baseline = await baselineService.getBaseline(req.params.baselineId);
  if (!baseline) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Baseline not found');
  }
  res.send(baseline);
});


const getByMilestone = catchAsync(async(req, res)=>{
  const milestoneBaseline = await baselineService.getByMilestone(req.params.milestoneId);
  res.send(milestoneBaseline);
});

const updateBaseline = catchAsync(async(req, res)=>{
  const baseline = await baselineService.updateBaseline(req.params.baselineId, req.body, req.body.tasks);
  delete req.body.tasks;
  res.send(baseline);
});
const deleteBaseline = catchAsync(async(req, res)=>{
    await baselineService.deleteBaseline(req.params.baselineId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBaseline,
  getBaselines,
  getBaseline,
  getByMilestone,
  updateBaseline,
  deleteBaseline,
};
