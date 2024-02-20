/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { budgetSession } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const budgetSessionRepository = dataSource.getRepository(budgetSession).extend({ findAll, sortBy });
/**
 * @module budgetSession
 */
 /**
 * Retrieves all budget sessions.
 * @function
 * @returns {Promise<object[]>} - A promise that resolves with an array of budget sessions.
 */
const getAllSessionBudget = async () => {
  return await budgetSessionRepository.find();
};
/**
 * Retrieves a budget session by its ID.
 * @function
 * @param {number} id - The unique identifier of the budget session.
 * @returns {Promise<object|null>} - A promise that resolves with the budget session object or null if not found.
 */
const getSessionBudget = async (id) => {
  return await budgetSessionRepository.findOneBy({ id: id });
};
/**
 * Creates a budget session.
 * @function
 * @param {object} budgetSessionBody - The data for the budget session.
 * @returns {Promise<object>} - A promise that resolves with the saved budget session.
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
 * @function
 * @returns {Promise<object|null>} - A promise that resolves with the active budget session object or null if not found.
 */
const activeBudgetSession = async () => {
  const lastSession = await budgetSessionRepository.findOneBy({ isActive: true });
  return lastSession;
};

/**
 * Updates a budget session.
 * @function
 * @param {number} budgetSessionId - The unique identifier of the budget session to update.
 * @param {object} updateBody - The data to update the budget session with.
 * @returns {Promise<object|null>} - A promise that resolves with the updated budget session object or null if not found.
 * @throws {ApiError} - Throws an error if the budget session is not found.
 */
const updateSessionBudget = async (budgetSessionId, updateBody) => {
  const budget = await budgetSessionRepository.update({ id: budgetSessionId }, updateBody);
  return await getSessionBudget(budgetSessionId);
};
/**
 * Retrieves a budget session by its start and end dates.
 * @fucntion
 * @param {object} Date - An object containing 'from' and 'to' properties representing the date range.
 * @param {string} Date.from - The start date of the range.
 * @param {string} Date.to - The end date of the range.
 * @returns {Promise<object|null>} - A promise that resolves with the budget session object or null if not found.
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
