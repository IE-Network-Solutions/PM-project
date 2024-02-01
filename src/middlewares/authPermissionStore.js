const authPermision = require('./authPermision');

module.exports = {
  seedPermissionMiddleware: authPermision(['view_aaa']),
};
