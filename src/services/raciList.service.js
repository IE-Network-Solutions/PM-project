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



// const projectstakholderRepository = dataSource.getRepository(ProjectStakHolder)


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

  const getRaciLists = async () => {
    return await raciListRepository.find({});
  }

  module.exports = {
    createRaciList,
    getRaciLists
  }