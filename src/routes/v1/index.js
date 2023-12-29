const express = require('express');

const currencyRoute = require('./currency.route');
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
const weeklyReportRoute = require('./weeklyReport.route');
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
const approval = require('./approval.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const resourceHistory = require('./resourceHistory.route');
const clientRoute = require('./client.route')
const budgetSessionRoute = require('./budgetSession.route')
const roleRoute = require('./role.route');
const monthlyBudget = require('./monthlyBudget.route');

///////////////////////////////////////////////////////
const qualityRoute = require('./quality.route');
const solutionRoute = require('./solution.route');
const criteriaRoute = require('./criteria.route');
const todoRoute = require('./todo.route');
const colorRoute = require('./color.route');
const checkListRoute = require('./checkList.route');
const evalutionRoute = require('./evalution.route');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/currencies',
    route: currencyRoute,
  },
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
    path: '/weekly-report',
    route: weeklyReportRoute,
  },
  {
    path: '/approval',
    route: approval,
  },
  {
    path: '/resourceHistory',
    route: resourceHistory,
  },
  {
    path: '/clients',
    route: clientRoute,
  },
  {
    path: '/budgetSession',
    route: budgetSessionRoute
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/monthlyBudget',
    route: monthlyBudget
  },

  ////////////////////////////////////////////////////
  {
    path: '/quality',
    route: qualityRoute
  },
  {
    path: "/solution",
    route: solutionRoute
  },
  {
    path: "/criteria",
    route: criteriaRoute
  },
  {
    path: "/todo",
    route: todoRoute
  },
  {
    path: "/color",
    route: colorRoute
  },
  {
    path: "/checkList",
    route: checkListRoute
  },
  {
    path: "/evalution",
    route: evalutionRoute
  }
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
