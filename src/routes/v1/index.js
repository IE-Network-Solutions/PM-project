const express = require('express');
const postRoute = require('./post.route');
const riskRoute = require('./risk.route');
const issueRoute = require('./issue.route');
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
