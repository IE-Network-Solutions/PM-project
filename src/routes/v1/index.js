const express = require('express');
const postRoute = require('./post.route');
const projectRoute = require('./project.route');
const milestoneRoute = require('./milestone.route');
const taskRoute = require('./task.route');
const subTaskRoute = require('./subtask.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/posts',
    route: postRoute,
  },
  {
    path: '/projects',
    route: projectRoute,
  }
  ,
  {
    path: '/milestones',
    route: milestoneRoute,
  }
  ,
  {  
    path: '/tasks',
    route: taskRoute,
  }
  ,
  {  
    path: '/subtasks',
    route: subTaskRoute,
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
