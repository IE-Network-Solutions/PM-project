const httpStatus = require('http-status');
const { startOfWeek, endOfWeek, addWeeks } = require('date-fns');
const { Between, IsNull, LessThan } = require('typeorm');
const { Task, TaskUser, Baseline, Milestone, Risk, Issue, WeeklyReport, WeeklyReportComment, User } = require('../models');
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
const weeklyCommentReportRepository = dataSource.getRepository(WeeklyReportComment).extend({
  findAll,
  sortBy,
});
const userRepository = dataSource.getRepository(User).extend({
  findAll,
  sortBy,
});
/**I
 * @module weeklyReport
 */
/**
 * Retrieves all active baseline tasks, next week's tasks, risks, and issues for the given project ID.
 * @function
 * @param {string} projectId - The ID of the project to retrieve the weekly report for.
 * @returns {Promise<Object>} A Promise that resolves with an object containing all active baseline tasks, next week's tasks, risks, and issues.
 */

const allActiveBaselineTasks = async (projectId) => {
  const getMilestoneByProject = await milestoneRepository.findBy({ projectId: projectId, status: true, relations: ['summaryTask.tasks'] });

  const allActiveBaselines = [];

  for (const eachMilestone of getMilestoneByProject) {
    const activeBaselines = await baselineRepository.findBy({
      status: true
    });

    allActiveBaselines.push(...activeBaselines);
  }

  const allTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
    });

    if (activeTasks.length > 0) {
      allTasks.push(...activeTasks);

    }
  }

  const tasksForVariance = [];

  for (const projectId of getMilestoneByProject) {
    const activeTasks = await taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.baseline', 'baseline')
      .leftJoinAndSelect('baseline.milestone', 'milestone')
      .leftJoinAndSelect('milestone.project', 'project')
      .where('project.id = :projectId', { projectId: projectId.projectId })
      .orderBy('task.plannedStart', 'ASC')
      .groupBy('baseline.id, milestone.id, project.id, task.id')
      .getMany();



    if (activeTasks.length > 0) {
      tasksForVariance.push(...activeTasks);
    }
  }

  const nextWeekTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      plannedStart: Between(startOfNextWeek, endOfNextWeek),
      actualStart: null
    });

    if (activeTasks.length > 0) {
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
    // allTasks: allTasks,
    // nextWeekTasks: nextWeekTasks,
    // risks: risks,
    // issues: issues,
    tasksForVariance: tasksForVariance
  };

  return weeklyReport;

};
/**
 * Retrieves the weekly report for the given project ID, including all tasks, sleeping tasks, next week's tasks, risks, and issues.
 * @function
 * @param {string} projectId - The ID of the project to retrieve the weekly report for.
 * @returns {Promise<Object>} A Promise that resolves with an object containing all tasks, sleeping tasks, next week's tasks, risks, and issues for the week.
 */

const getWeeklyReport = async (projectId) => {
  const getMilestoneByProject = await milestoneRepository.findBy({
    projectId: projectId,
    status: true
  });


  const allActiveBaselines = [];

  for (const eachMilestone of getMilestoneByProject) {
    const activeBaselines = await baselineRepository.findBy({
      projectId: projectId,
      status: true
    });

    allActiveBaselines.push(...activeBaselines);
  }
  const allTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    const activeTasks = await taskRepository.find({
      where: {
        baselineId: eachAllActiveBaselines.id,
      },
      relations: ['baseline.project']
    });

    if (activeTasks.length > 0) {
      allTasks.push(...activeTasks);

    }
  }


  const sleepingTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    // const activeTasks = await taskRepository.findBy({
    //   baselineId: eachAllActiveBaselines.id,
    //   plannedStart: Between(startOfWeekDate, endOfWeekDate),
    //   actualStart: IsNull()
    // });
    const activeTasks = await taskRepository.find({
      where: [
        { baselineId: eachAllActiveBaselines.id, plannedStart: LessThan(new Date()), actualStart: IsNull() },
        { baselineId: eachAllActiveBaselines.id, plannedFinish: LessThan(new Date()), actualFinish: IsNull() }
      ]
    });

    if (activeTasks.length > 0) {
      sleepingTasks.push(...activeTasks);

    }
  }


  const nextWeekTasks = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      plannedStart: Between(startOfNextWeek, endOfNextWeek),
      actualStart: null
    });

    if (activeTasks.length > 0) {
      nextWeekTasks.push(...activeTasks);
    }
  }


  const projectStatusReport = [];

  for (const eachAllActiveBaselines of allActiveBaselines) {
    const activeTasks = await taskRepository.findBy({
      baselineId: eachAllActiveBaselines.id,
      actualStart: Between(startOfWeekDate, endOfWeekDate),

    });

    if (activeTasks.length > 0) {
      projectStatusReport.push(...activeTasks);
    }
  }

  const issues = await issueRepository.find({

    where: {
      projectId: projectId,
      // createdAt: Between(startOfWeekDate, endOfWeekDate),
    },
  });



  const risks = await riskRepository.find({
    where: {
      projectId: projectId,
      // createdAt: Between(startOfWeekDate, endOfWeekDate),
    },
  });

  allTasks.sort((a, b) => (a.order) - (b.order));
  sleepingTasks.sort((a, b) => (a.order) - (b.order));
  nextWeekTasks.sort((a, b) => (a.order) - (b.order));
  projectStatusReport.sort((a, b) => (a.order) - (b.order));

  const weeklyReport = {
    allTasks: filterTasks(allTasks),
    sleepingTasks: filterTasks(sleepingTasks),
    nextWeekTasks: filterTasks(nextWeekTasks),
    projectStatusReport: filterTasks(projectStatusReport),
    risks: risks,
    issues: issues,
  };
  console.log(weeklyReport, "weeklyReport")
  return weeklyReport;

};
/**
 * Adds sleeping reason to the tasks provided and returns the updated tasks.
 * @function
 * @param {Array<Object>} tasks - The tasks to update with sleeping reasons.
 * @returns {Promise<Array<Object>>} A Promise that resolves with the updated tasks.
 */

const addSleepingReason = async (tasks) => {
  const updatedTasks = [];

  for (const taskData of tasks) {
    const taskId = taskData.id;
    const sleepingReason = taskData.sleepingReason;

    const updateFields = { sleepingReason: sleepingReason };

    const updateResult = await taskRepository.update(taskId, updateFields);

    if (updateResult.affected > 0) {
      const updatedTask = await taskRepository.findOneBy({ id: taskId });
      if (updatedTask) {
        updatedTasks.push(updatedTask);
      }
    }
  }

  return updatedTasks;
};
/**
 * Adds a weekly report for the specified project ID with the provided data.
 * @function
 * @param {string} projectId - The ID of the project to add the weekly report for.
 * @param {Object} weeklyReportData - The data for the weekly report.
 * @returns {Promise<Object>} A Promise that resolves with the added weekly report.
 */

const addWeeklyReport = async (projectId, weeklyReportData) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = currentDate.getMonth() + 1;

  const risks = weeklyReportData.risks;
  const issues = weeklyReportData.issues;
  const sleepingTasks = weeklyReportData.sleepingTasks;
  const nextWeekTasks = weeklyReportData.nextWeekTasks;
  const overAllProgress = weeklyReportData.overAllProgress;
  const projectStatusReport = weeklyReportData.projectStatusReport;

  // return [projectId, currentMonthNumber, risks, issues, sleepingTasks, nextWeekTasks,]


  const dayOfMonth = currentDate.getDate();
  const weekOfMonth = Math.ceil(dayOfMonth / 7);

  const addedWeeklyReport = weeklyReportRepository.create({
    projectId: projectId,
    year: currentYear,
    month: currentMonthNumber,
    week: weekOfMonth, // Add the calculated week of the month
    issues: issues,
    risks: risks,
    sleepingTasks: sleepingTasks,
    nextWeekTasks: nextWeekTasks,
    overAllProgress: overAllProgress,
    projectStatusReport: projectStatusReport,
  });

  const savedWeeklyReport = await weeklyReportRepository.save(addedWeeklyReport);
  return savedWeeklyReport;
}
/**
 * Retrieves the added weekly report for the specified project ID.
 * @function
 * @param {string} projectId - The ID of the project to retrieve the added weekly report for.
 * @returns {Promise<Object>} A Promise that resolves with the added weekly report.
 */

const getAddedWeeklyReport = async (projectId) => {
  const savedWeeklyReport = await weeklyReportRepository.findBy({ projectId });

  // Group the fetched reports by week and fetch only the first item in each group
  const groupedWeeklyReports = savedWeeklyReport.reduce((result, report) => {
    if (!result[report.week]) {
      result[report.week] = report; // Fetch the first report in the group
    }
    return result;
  }, {});

  return groupedWeeklyReports;
};
/**
 * Retrieves the weekly report for the specified project ID and week.
 * @function
 * @param {string} projectId - The ID of the project to retrieve the weekly report for.
 * @param {number} week - The week number of the report to retrieve.
 * @returns {Promise<Array<Object>>} A Promise that resolves with the weekly report for the specified project and week.
 */

const getReportByWeek = async (projectId, week) => {
  const reportByWeek = await weeklyReportRepository.find({
    where: { projectId: projectId, id: week },
    relations: ['project']
  });
  return reportByWeek;
};
/**
 * Adds a comment to a weekly report.
 * @function
 * @param {Object} comment - The comment object containing the weekly report ID, user ID, and comment.
 * @param {string} comment.id - The ID of the weekly report to add the comment to.
 * @param {string} comment.userId - The ID of the user adding the comment.
 * @param {string} comment.comment - The comment content.
 * @returns {Promise<Object>} A Promise that resolves with the added comment.
 */

const addComment = async (comment) => {
  const weeklyReportComment = weeklyCommentReportRepository.create({
    weeklyReportId: comment.id,
    userId: comment.userId,
    comment: comment.comment,
  });

  const savedComment = await weeklyCommentReportRepository.save(weeklyReportComment);

  const sender = await userRepository.findOne({
    where: {
      id: savedComment.userId
    }
  }
  );

  savedComment.user = sender;
  return savedComment;
}
/**
 * Retrieves comments for a weekly report.
 * @function
 * @param {string} weeklyReportId - The ID of the weekly report to retrieve comments for.
 * @returns {Promise<Array<Object>>} A Promise that resolves with an array of comments for the specified weekly report.
 */

const getComments = async (weeklyReportId) => {

  return await weeklyCommentReportRepository.find(
    {
      where: { weeklyReportId: weeklyReportId, },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    }
  );
}
const filterTasks = (tasks) => {
  let uniqueIds = {};
  let filteredArray = tasks.filter(item => {
    if (!uniqueIds[item.id]) {
      uniqueIds[item.id] = true;
      return true; // Keep the item
    }
    return false; // Discard the item
  });
  return filteredArray
}

module.exports = {
  getWeeklyReport,
  addSleepingReason,
  allActiveBaselineTasks,
  addWeeklyReport,
  getAddedWeeklyReport,
  getReportByWeek,
  addComment,
  getComments
};
