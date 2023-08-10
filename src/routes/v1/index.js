const express = require('express');
const postRoute = require('./post.route');
const riskRoute = require('./risk.route');
const issueRoute = require('./issue.route');
const AAARoute = require('./AAA.route');
const relatedIssue = require('./relatedIssue.route');
const actionRoute = require('./action.route');
const afterActionAnalysisActionRoute = require('./afterActionAnalysisIssueRelated.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/posts',
    route: postRoute,
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
