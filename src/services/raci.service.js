const httpStatus = require('http-status');
const { Raci,ProjectRaci} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { taskService, baselineService, milestoneService } = require('.');
//const ProjectStakholder = require('../models/projectStakholder.model');
const Project = require('../models/project.model');


const raciRepository = dataSource.getRepository(Raci).extend({
  findAll,
  sortBy,
});

const projectRepository = dataSource.getRepository(Project).extend({
  findAll,
  sortBy,
});


const projectraciRepository = dataSource.getRepository(ProjectRaci)


const createRaci = async (raciBody) => {
    try {
   
      const project = await projectRepository.findOne({
        where: { id: raciBody.project_id },
      });
  
      if (!project) {
        throw new Error('Project not found');
      }
      console.log(project,"projecttttt")
      // Create Stakholder entity using properties directly
      const raci = raciRepository.create({
        project_tasks: raciBody.project_tasks,
        project_manager: raciBody.project_manager,
        tech_team_lead: raciBody.tech_team_lead,
        doo: raciBody.doo,
        pmom: raciBody.pmom,
        so: raciBody.so,
        lo: raciBody.lo,
        pfo: raciBody.pfo,
        fe: raciBody.fe,
        client: raciBody.client,
        ceo: raciBody.ceo,

      });
  
      const savedRaci = await raciRepository.save(raci);
      // console.log(project,"projecttttt",savedRaci,"raciiiiiiiiiiiiiii")

      const projectRaciData = { projectId: raciBody.project_id, raciId: savedRaci.id };
      console.log('Project Raci Data:', raciBody.project_id);
      const projectRaci = projectraciRepository.create(projectRaciData);
  console.log(projectRaci,"projecr-raci---------------")

      await projectraciRepository.save(projectRaci);
      return savedRaci;
      
    } catch (error) {
      console.error('Error creating Stakholder:', error);
      throw error; // Rethrow the error to allow for further handling
    }
  };

  const getRacis = async () => {
    return await raciRepository.find({});
  }

  const getRacisById =async (raciId) => {
    return await raciRepository.findOne({
        where: { id: raciId}
    });
  }
  async function deleteRaciById(raciId) {
    try {
        const raci = await raciRepository.findOne({
            where: { id: raciId }
        });
        if (!raci) {
            throw new Error(`Raci with ID ${raciId} not found`);
        }
    //     if (raci.isDeleted===true) {
    //       throw new Error(`Error: raci with ID ${raciId} does not exist`);
    //   }
        // Soft delete by updating the isDeleted field to true
        // raci.isDeleted = true;
  
        await raciRepository.remove(raci); // Use save to update the record
  
        return {
          success: true,
          message: `Raci with ID ${raciId} soft deleted successfully`
      };
  
    } catch (error) {
        console.error(`Error soft deleting raci: ${error.message}`);
        throw error; // Rethrow the error to allow for further handling
    }
  }

  const updateRaciById = async (raciId, updatedData) => {
    try {
      // Retrieve the stakholder by ID
      const raci = await raciRepository.findOne({
        where:{ id: raciId }
    });
  
      if (!raci) {
        throw new Error(`Raci with ID ${raciId} not found`);
      }
   
      // Update stakholder data
      raci.project_tasks = updatedData.project_tasks;
      raci.project_manager = updatedData.project_manager;
      raci.tech_team_lead = updatedData.tech_team_lead;
      raci.doo=updatedData.doo,
      raci.pmom=updatedData.pmom,
      raci.so=updatedData.so,
      raci.lo=updatedData.lo,
      raci.pfo=updatedData.pfo,
      raci.fe=updatedData.fe,
      raci.client=updatedData.client,
      raci.ceo=updatedData.ceo,
      raci.raci=updatedData.raci,
      // ... other fields you want to update
  
      // Save the updated stakholder
      await raciRepository.save(raci);
  
      console.log(`Raci with ID ${raciId} updated successfully`);
      
      // Optionally, you can return the updated stakholder
      return raci;
    } catch (error) {
      console.error(`Error updating raci: ${error.message}`);
      throw error; // Rethrow the error to allow for further handling
    }
  };

  const getRacisByProjectId = async (projectId) => {
    try {
        // Assuming there's a 'projectstakholder' table/entity in your database
        // This example assumes you're using TypeORM, adjust accordingly for your ORM or repository
        const projectRacis = await projectraciRepository.find({
            where: { projectId },
            relations: ['raci'], // Assuming there's a relation between 'projectstakholder' and 'stakholder'
        });
  
        // Filter out only stakeholders where isDeleted is false
        const activeRacis = projectRacis
            .filter((projectRaci) => projectRaci.raci)
            .map((projectRaci) => projectRaci.raci);
  
        console.log(activeRacis, "Active project stakeholders");
  
        return activeRacis;
    } catch (error) {
        console.error('Error finding stakeholders by project ID:', error);
        throw error; // Rethrow the error to allow for further handling
    }
  };
  
  module.exports = {
    createRaci,
    getRacis,
    getRacisById,
    getRacisById,
    deleteRaciById,
    updateRaciById,
    getRacisByProjectId
  }