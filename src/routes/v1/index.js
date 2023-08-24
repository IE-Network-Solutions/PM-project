const express = require('express');

const riskRoute = require('./risk.route');
const issueRoute = require('./issue.route');
const AAARoute = require('./AAA.route');
const relatedIssue = require('./relatedIssue.route');
const actionRoute = require('./action.route');
const afterActionAnalysisActionRoute = require('./afterActionAnalysisIssueRelated.route');
const projectRoute = require('./project.route');
const milestoneRoute = require('./milestone.route');
const baselineRoute = require('./baseline.route');
const taskRoute = require('./task.route');
const subTaskRoute = require('./subtask.route');
const momRoute = require('./mom.route');
const usersRoute = require('./user.route');
const leasonLearnedRoute = require('./lessonLearned.route');
const individualLLRoute = require('./individualLL.route');
const LLCommentRoute = require('./llComment.route');
const PaymentTermRoute = require('./paymentTerm.route');

const budgetCategoryRoute = require('./budgetCategory.route');
const budgetTypeRoute = require('./budgetType.route');
const budgetTaskCategoryRoute = require('./budgetTaskCategory.route');
const budgetRoute = require('./budget.route');
const approvalModuleRoute = require('./approvalModule.route');
const approvalLevelRoute = require('./approvalLevel.route');
const approvalStageRoute = require('./approvalStage.route');

const departmentRoute = require('./department.route');
const weeklyReportRoute = require('./weeklyReport.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/risks',
    route: riskRoute,
  },
  {
    path: '/issues',
    route: issueRoute,
  },
  {
    path: '/AAA',
    route: AAARoute,
  },

  {
    path: '/relatedIssues',
    route: relatedIssue,
  },

  {
    path: '/actions',
    route: actionRoute,
  },

  {
    path: '/afterActionAnalysisAction',
    route: afterActionAnalysisActionRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  },
  {},
  {
    path: '/payment-terms',
    route: PaymentTermRoute,
  },
  {
    path: '/milestones',
    route: milestoneRoute,
  },
  {
    path: '/baselines',
    route: baselineRoute,
  },
  {
    path: '/tasks',
    route: taskRoute,
  },
  {
    path: '/subtasks',
    route: subTaskRoute,
  },
  {
    path: '/mom',
    route: momRoute,
  },
  {
    path: '/users',
    route: usersRoute,
  },
  {
    path: '/lessonLearned',
    route: leasonLearnedRoute,
  },
  {
    path: '/individualLL',
    route: individualLLRoute,
  },
  {
    path: '/llcomment',
    route: LLCommentRoute,
  },
  {
    path: '/budgetCategory',
    route: budgetCategoryRoute,
  },
  {
    path: '/budgetTaskCategory',
    route: budgetTaskCategoryRoute,
  },
  {
    path: '/budgetType',
    route: budgetTypeRoute,
  },
  {
    path: '/budget',
    route: budgetRoute,
  },
  {
    path: '/approvalModule',
    route: approvalModuleRoute,
  },
  {
    path: '/approvalLevel',
    route: approvalLevelRoute,
  },
  {
    path: '/approvalStage',
    route: approvalStageRoute,
  },
  {
    path: '/departments',
    route: departmentRoute,
  },
  {
    path: '/weeklyReport',
    route: weeklyReportRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
