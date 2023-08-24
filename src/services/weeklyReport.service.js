const httpStatus = require('http-status');
const { getRiskByProjectId } = require('./risk.service');
const { getIssueByProjectId } = require('./issue.service');
const { riskService, issueService } = require('.');
/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getWeeklyReportByProjectByDate = async (id, startDate, endDate) => {

    const riskResult = await riskService.getAllRisksByProjectIdAndByDate(id, startDate, endDate);
    const issueResult = await issueService.getAllIssuesByProjectIdAndByDate(id, startDate, endDate);

    return {
        Risk: riskResult,
        Issue: issueResult
    }
};

module.exports = {
    getWeeklyReportByProjectByDate,
};
