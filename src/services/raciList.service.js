const httpStatus = require('http-status');
const { RaciList} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { taskService, baselineService, milestoneService } = require('.');
//const ProjectStakholder = require('../models/projectStakholder.model');
// const Project = require('../models/project.model');


const raciListRepository = dataSource.getRepository(RaciList).extend({
  findAll,
  sortBy,
});
/**
 * @module raciList
 */
/**
 * Creates a RACI (Responsible, Accountable, Consulted, Informed) list entry.
 *
 * @function
 * @param {Object} raciBody - Data representing the RACI list entry.
 *   - {string} name - The name of the RACI list.
 *   - {string} description - A description of the RACI list.
 * @throws {Error} - Throws an error if there's an issue creating the RACI list.
 * @returns {Promise<Object>} - A promise that resolves to the saved RACI list entry.
 */
const createRaciList = async (raciBody) => {
    try {

      // Create Stakholder entity using properties directly
      const raciList = raciListRepository.create({
        name: raciBody.name,
        describtion: raciBody.describtion,


      });

      const savedRaciList = await raciListRepository.save(raciList);


      return savedRaciList;

    } catch (error) {
      console.error('Error creating Stakholder:', error);
      throw error; // Rethrow the error to allow for further handling
    }
  };
/**
 * Retrieves RACI (Responsible, Accountable, Consulted, Informed) lists from the repository.
 *
 * @function
 * @returns {Promise<Object[]>} - A promise that resolves to an array of RACI lists.
 */
  const getRaciLists = async () => {
    return await raciListRepository.find({});
  }

  module.exports = {
    createRaciList,
    getRaciLists
  }
