const authPermision = require('./authPermision');

module.exports = {
  seedPermissionMiddleware: authPermision(['view_aaa']),
  createProjectMiddleware: authPermision(['create_project']),
  editProjectMiddleware: authPermision(['edit_project']),
  deleteProjectMiddleware: authPermision(['delete_project']),
  closeProjectMiddleware: authPermision(['close_project']),
  addProjectBoqMiddleware: authPermision(['add_project_boq']),
  downloadProjectBoqMiddleware: authPermision(['download_project_boq']),
  addProjectMemberMiddleware: authPermision(['add_project_memeber']),
  removeProjectMemberMiddleware: authPermision(['remove_project_memeber']),
  addProjectMilestoneMiddleware: authPermision(['add_milestone']),
  editProjectMilestoneMiddleware: authPermision(['edit_milestone']),
  deleteProjectMilestoneMiddleware: authPermision(['delete_milestone']),
  addProjectScheduleMilestoneMiddleware: authPermision(['add_schedule']),
  addProjectPaymentTermMiddleware: authPermision(['add_payment_term']),
  editProjectPaymentTermMiddleware: authPermision(['edit_payment_term']),
  createProjectBudgetMiddleware: authPermision(['create_project_budget']),
  editProjectBudgetMiddleware: authPermision(['edit_project_budget']),
  deleteProjectBudgetMiddleware: authPermision(['delete_project_budget']),
};
