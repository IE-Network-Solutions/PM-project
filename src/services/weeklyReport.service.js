const httpStatus = require('http-status');
const { riskService, issueService, projectService, milestoneService } = require('../services');
/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
// const getAllMilestones = async (filter, options) => {
//     const { limit, page, sortBy } = options;

//     return await milestoneService.getMilestones({
//         sortOptions: sortBy && { option: sortBy },
//         paginationOptions: { limit: limit, page: page },
//     });
// }
const getWeeklyReportByProjectByDate = async (id, status, startDate, endDate) => {

    const riskResult = await riskService.getAllRisksByProjectIdAndByDate(id, status, startDate, endDate);
    const issueResult = await issueService.getAllIssuesByProjectIdAndByDate(id, "Transfered", startDate, endDate);
    return {
        Risk: riskResult,
        Issue: issueResult,
    }
};

module.exports = {
    getWeeklyReportByProjectByDate,
};
