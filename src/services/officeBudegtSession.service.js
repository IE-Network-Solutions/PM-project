/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { OfficeBudgetSession } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetSessionRepository = dataSource.getRepository(OfficeBudgetSession).extend({ findAll, sortBy });
/**
 * @module OfficeBudgetSession
 */
/**
 * Retrieves all budget sessions.
 *
 * @function
 * @returns {Promise<Array>} An array of budget sessions.
 */
const getAllSessionBudget = async () => {
    return await budgetSessionRepository.find();
};

/**
 * Retrieves a budget session by its ID.
 *
 * @function
 * @param {string} id - The ID of the budget session.
 * @returns {Promise<Object>} The budget session object.
 */
const getSessionBudget = async (id) => {
    return await budgetSessionRepository.findOneBy({ id: id });
};
/**
 * Creates a new budget session.
 *
 * @function
 * @param {Object} budgetSessionBody - The data for the new budget session.
 * @param {boolean} budgetSessionBody.isActive - Indicates whether the session is active.
 * @param {string} budgetSessionBody.startDate - Start date of the session.
 * @param {string} budgetSessionBody.endDate - End date of the session.
 * @returns {Promise<Object>} The newly created budget session object.
 */

const createBudgetSession = async (budgetSessionBody) => {
    const lastSession = await budgetSessionRepository.findOneBy({ isActive: true });
    if (lastSession !== null) {
        lastSession.isActive = false;
        await updateSessionBudget(lastSession.id, lastSession);
    }

    const budgetSession = budgetSessionRepository.create(budgetSessionBody);
    return await budgetSessionRepository.save(budgetSession);
};
/**
 * Retrieves the active budget session.
 *
 * @function
 * @returns {Promise<Object>} The active budget session object.
 */
const activeBudgetSession = async () => {
    const lastSession = await budgetSessionRepository.findOneBy({ isActive: true });
    return lastSession;
};
/**
 * Updates an existing budget session.
 *
 * @function
 * @param {string} budgetSessionId - The ID of the budget session to be updated.
 * @param {Object} updateBody - The updated data for the budget session.
 * @returns {Promise<Object>} The updated budget session object.
 */
const updateSessionBudget = async (budgetSessionId, updateBody) => {
    const budget = await budgetSessionRepository.update({ id: budgetSessionId }, updateBody);
    return await getSessionBudget(budgetSessionId);
};
/**
 * Retrieves a budget session by its date range.
 *
 * @function
 * @param {Object} Date - An object representing the date range.
 * @param {string} Date.from - Start date of the session.
 * @param {string} Date.to - End date of the session.
 * @returns {Promise<Object>} The budget session object for the specified date range.
 */
const getSessionBudgetByDate = async (Date) => {
    return await budgetSessionRepository.findOne({ where: { startDate: Date.from, endDate: Date.to } });

};

module.exports = {
    getSessionBudget,
    createBudgetSession,
    updateSessionBudget,
    getAllSessionBudget,
    activeBudgetSession,
    getSessionBudgetByDate
};
