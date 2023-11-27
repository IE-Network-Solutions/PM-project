/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { budgetSession } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetSessionRepository = dataSource.getRepository(budgetSession).extend({ findAll, sortBy });

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getAllSessionBudget = async (id) => {
    return await budgetSessionRepository.find();
  };

/**
 * Get budget by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getSessionBudget = async (id) => {
    return await budgetSessionRepository.findOneBy({ id: id });
  };

/**
 * Create a risk
 * @param {Object} userBody
 * @returns {Promise<budgetSession>}
 */
const createBudgetSession = async (budgetSessionBody) => {
    const lastSession = await budgetSessionRepository.findOneBy({ isActive: true });
    lastSession.isActive = false;
    await updateSessionBudget(lastSession.id, lastSession);
    const budgetSession = budgetSessionRepository.create(budgetSessionBody);
    return await budgetSessionRepository.save(budgetSession);
};

/**
 * Update budget by id
 * @param {ObjectId} budgetId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updateSessionBudget = async (budgetSessionId, updateBody) => {
    const budget = await budgetSessionRepository.update({ id: budgetSessionId }, updateBody);
    return await getSessionBudget(budgetSessionId);
  };

module.exports = {
    getSessionBudget,
    createBudgetSession,
    updateSessionBudget,
    getAllSessionBudget
}

