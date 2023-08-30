const httpStatus = require('http-status');
const { startOfWeek, endOfWeek, addWeeks } = require('date-fns');
const { Between } = require('typeorm');
const { Task, TaskUser, Baseline, Milestone, Risk, Issue, WeeklyReport } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const services = require('./index');

const startOfWeekDate = startOfWeek(new Date());
const endOfWeekDate = endOfWeek(new Date());
const startOfNextWeek = startOfWeek(addWeeks(new Date(), 1));
const endOfNextWeek = endOfWeek(addWeeks(new Date(), 1));


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
const weeklyReportRepository = dataSource.getRepository(WeeklyReport).extend({
  findAll,
  sortBy,
});


const allActiveBaselineTasks = async (projectId) => {
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

  const allTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
    });

    if(activeTasks.length > 0){
      allTasks.push(...activeTasks); 
      
    }
  }
  
  const nextWeekTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      plannedStart: Between(startOfNextWeek, endOfNextWeek),
      actualStart: null
    });

    if(activeTasks.length > 0){
      nextWeekTasks.push(...activeTasks); 
    }
  }

  const issues = await issueRepository.find({
    
    where: {
      projectId: projectId,
      createdAt: Between(startOfWeekDate, endOfWeekDate),
    },
  });



const risks = await riskRepository.find({
  where: {
    projectId: projectId,
    createdAt: Between(startOfWeekDate, endOfWeekDate),
  },
});


  const weeklyReport = {
    allTasks: allTasks,
    nextWeekTasks: nextWeekTasks,
    risks: risks,
    issues: issues,
  };

  return weeklyReport;

};



const getWeeklyReport = async (projectId) => {
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

  const allTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.find({
      where: {
        baselineId: eachAllActiveBaselines.id,
      },
      relations: ['baseline.milestone.project']
    });

    if(activeTasks.length > 0){
      allTasks.push(...activeTasks); 
      
    }
  }


  const sleepingTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      plannedStart: Between(startOfWeekDate, endOfWeekDate),
      actualStart: null
    });

    if(activeTasks.length > 0){
      sleepingTasks.push(...activeTasks); 
      
    }
  }
  
  
  const nextWeekTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines){
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      plannedStart: Between(startOfNextWeek, endOfNextWeek),
      actualStart: null
    });

    if(activeTasks.length > 0){
      nextWeekTasks.push(...activeTasks); 
    }
  }

  const issues = await issueRepository.find({
    
    where: {
      projectId: projectId,
      createdAt: Between(startOfWeekDate, endOfWeekDate),
    },
  });



const risks = await riskRepository.find({
  where: {
    projectId: projectId,
    createdAt: Between(startOfWeekDate, endOfWeekDate),
  },
});


  const weeklyReport = {
    allTasks: allTasks,
    sleepingTasks: sleepingTasks,
    nextWeekTasks: nextWeekTasks,
    risks: risks,
    issues: issues,
  };

  return weeklyReport;

};


const addSleepingReason = async (tasks) => {
  const updatedTasks = [];

  for (const taskData of tasks) {
    const taskId = taskData.id;
    const sleepingReason = taskData.sleepingReason;

    const updateFields = { sleepingReason: sleepingReason };

    const updateResult = await taskRepository.update(taskId, updateFields);

    if (updateResult.affected > 0) {
      const updatedTask = await taskRepository.findOneBy({id: taskId}); 
      if (updatedTask) {
        updatedTasks.push(updatedTask);
      }
    }
  }

  return updatedTasks;
};

const addWeeklyReport = async(projectId, weeklyReportData)=>{
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = currentDate.getMonth() + 1;
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentMonthName = monthNames[currentMonthNumber - 1];

  const risks = weeklyReportData.risks;
  const issues = weeklyReportData.issues;
  const sleepingTasks = weeklyReportData.sleepingTasks;
  const nextWeekTasks = weeklyReportData.nextWeekTasks;

  // return [projectId, currentMonthNumber, risks, issues, sleepingTasks, nextWeekTasks,]


  const dayOfMonth = currentDate.getDate();
  const weekOfMonth = Math.ceil(dayOfMonth / 7);
  
  const addedWeeklyReport =  weeklyReportRepository.create({
    projectId: projectId,
    year: currentYear,
    month: currentMonthNumber,
    week: weekOfMonth, // Add the calculated week of the month
    issues: issues,
    risks: risks,
    sleepingTasks: sleepingTasks,
    nextWeekTasks: nextWeekTasks,
  });

  const savedWeeklyReport = await weeklyReportRepository.save(addedWeeklyReport);
  return savedWeeklyReport;
}




module.exports = {
  getWeeklyReport,
  addSleepingReason,
  allActiveBaselineTasks,
  addWeeklyReport
};
