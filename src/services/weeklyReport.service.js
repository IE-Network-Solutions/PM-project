const httpStatus = require('http-status');
const { Task, TaskUser, Baseline, Milestone, Risk, Issue } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');


const taskRepository = dataSource.getRepository(Task).extend({
  findAll,
  sortBy,
});

const taskUserRepository = dataSource.getRepository(TaskUser).extend({
  findAll,
  sortBy,
});
const baselineRepository = dataSource.getRepository(Baseline).extend({
  findAll,
  sortBy,
});
const milestoneRepository = dataSource.getRepository(Milestone).extend({
  findAll,
  sortBy,
});
const riskRepository = dataSource.getRepository(Risk).extend({
  findAll,
  sortBy,
});
const issueRepository = dataSource.getRepository(Issue).extend({
  findAll,
  sortBy,
});


const weeklyReport = async (projectId) => {
  const getMilestoneByProject = await milestoneRepository.findBy({
    projectId: projectId,
    status: true
  });


  const allActiveBaselines = [];

  for (const eachMilestone of getMilestoneByProject){
    const activeBaselines = await baselineRepository.findBy({
      milestoneId: eachMilestone.id,
      status: true
    });

    allActiveBaselines.push(...activeBaselines); 
  }


  const allActiveTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      status: true
    });

    allActiveTasks.push(activeTasks); 
  }

  const risks = await riskRepository.findBy({
    projectId: projectId
  });

  const issues = await issueRepository.findBy({
    projectId: projectId
  });

  const weeklyTasks = allActiveTasks;
  const nextWeekTasks = allActiveTasks;

  const weeklyReport = {
    risks: risks,
    issues: issues,
    weeklyTasks: weeklyTasks,
    nextWeekTasks: nextWeekTasks
  };

  return weeklyReport;

};

module.exports = {
  weeklyReport,
};
