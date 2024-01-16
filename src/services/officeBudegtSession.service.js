/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { OfficeBudgetSession } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetSessionRepository = dataSource.getRepository(OfficeBudgetSession).extend({ findAll, sortBy });

/**
 * Get all budget session by
 * @returns {Promise<Project>}
 */
const getAllSessionBudget = async () => {
    return await budgetSessionRepository.find();
};

/**
 * Get budget session by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getSessionBudget = async (id) => {
    return await budgetSessionRepository.findOneBy({ id: id });
};

/**
 * Create a budget session
 * @param {Object} budgetSessionbody
 * @returns {Promise<budgetSession>}
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
 * get active budget session
 * @param {Object} budgetSessionbody
 * @returns {Promise<budgetSession>}
 */
const activeBudgetSession = async () => {
    const lastSession = await budgetSessionRepository.findOneBy({ isActive: true });
    return lastSession;
};

/**
 * Update budget session by
 * @param {ObjectId} budgetId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateSessionBudget = async (budgetSessionId, updateBody) => {
    const budget = await budgetSessionRepository.update({ id: budgetSessionId }, updateBody);
    return await getSessionBudget(budgetSessionId);
};
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
