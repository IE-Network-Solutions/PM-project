const httpStatus = require('http-status');
const { StakHolder,ProjectStakHolder } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { taskService, baselineService, milestoneService } = require('.');
//const ProjectStakholder = require('../models/projectStakholder.model');
const Project = require('../models/project.model');


const stakholderRepository = dataSource.getRepository(StakHolder).extend({
  findAll,
  sortBy,
});

const projectRepository = dataSource.getRepository(Project).extend({
    findAll,
    sortBy,
  });

const projectstakholderRepository = dataSource.getRepository(ProjectStakHolder)


// .extend({ sortBy });


/**
 * Create a user
 * @param {Object} resourceBody
 * @returns {Promise<Project>}
 */
const createStakHolder = async (stakholderBody) => {
    try {
      const project = await projectRepository.findOne({
        where: { id: stakholderBody.project_id },
      });
  
      if (!project) {
        throw new Error('Project not found');
      }
      let matrix;
      const influence = stakholderBody.influence;
      const impact = stakholderBody.impact;
      
      if (influence === 'Low' && impact === 'Low') {
          matrix = 'Monitor';
      } else if (influence === 'Low' && impact === 'High') {
          matrix = 'Keep Informed';
      } else if (influence === 'High' && impact === 'Low') {
          matrix = 'Keep Satisfied';
      } else if (influence === 'High' && impact === 'High') {
          matrix = 'Manage Closely';
      } else {
          // Default case if none of the conditions are met
          matrix = 'Default Value';
      }
      // Create Stakholder entity using properties directly
      const stakholder = stakholderRepository.create({
        title: stakholderBody.title,
        email: stakholderBody.email,
        phone_number:stakholderBody.phone_number,
        stakeholder_name: stakholderBody.stakeholder_name,
        project_role: stakholderBody.project_role,
        influence: stakholderBody.influence,
        impact: stakholderBody.impact,
        support: stakholderBody.support,
        matrix:matrix,
        engage_stakeholder: stakholderBody.engage_stakeholder,
        decision_maker: stakholderBody.decision_maker,
        communication_frequency: stakholderBody.communication_frequency,
        ways_of_communication: stakholderBody.ways_of_communication,

      });
  
      const savedStakholder = await stakholderRepository.save(stakholder);
  
      // Logging for debugging purposes
      const projectStakholderData = { projectId: stakholderBody.project_id, stakholderId: savedStakholder.id };
      console.log('Project Stakholder Data:', stakholderBody.project_id);
  
      const projectStakholder = projectstakholderRepository.create(projectStakholderData);
      await projectstakholderRepository.save(projectStakholder);
      return savedStakholder;
      
    } catch (error) {
      console.error('Error creating Stakholder:', error);
      throw error; // Rethrow the error to allow for further handling
    }
  };
  

const getStakHolders = async () => {
    return await stakholderRepository.find({
      where: { isDeleted: false }
    }); // Assuming there is a find function in your repository to retrieve all stakeholders
  };

  const getStakHoldersById = async (stakholderId) => {
    return await stakholderRepository.findOne({
      where: { id: stakholderId, isDeleted: false}
    });
  };
//   const deleteStakHoldersById = async (stakholderId) => {
//     // Soft delete the stakholder by ID
//     await stakholderRepository.update(stakholderId, { isDeleted: true });
// };
async function deleteStakHoldersById(stakeholderId) {
  try {
      const stakeholder = await stakholderRepository.findOne({
          where: { id: stakeholderId }
      });
      if (!stakeholder) {
          throw new Error(`Stakeholder with ID ${stakeholderId} not found`);
      }
      if (stakeholder.isDeleted===true) {
        throw new Error(`Error: Stakeholder with ID ${stakeholderId} does not exist`);
    }
      // Soft delete by updating the isDeleted field to true
      stakeholder.isDeleted = true;

      await stakholderRepository.save(stakeholder); // Use save to update the record

      return {
        success: true,
        message: `Stakeholder with ID ${stakeholderId} soft deleted successfully`
    };

  } catch (error) {
      console.error(`Error soft deleting stakeholder: ${error.message}`);
      throw error; // Rethrow the error to allow for further handling
  }
}


const updateStakHoldersById = async (stakholderId, updatedData) => {
    try {
      // Retrieve the stakholder by ID
      const stakholder = await stakholderRepository.findOne({
        where:{ id: stakholderId }
    });
  
      if (!stakholder) {
        throw new Error(`Stakeholder with ID ${stakholderId} not found`);
      }
      if (stakholder.isDeleted===true) {
        throw new Error(`Error: Stakeholder with ID ${stakholderId} does not exist`);
    }
      // Update stakholder data
      stakholder.stakeholder_name = updatedData.stakeholder_name;
      stakholder.email = updatedData.email;

      stakholder.title=updatedData.title,
      stakholder.phone_number=updatedData.phone_number,
      stakholder.project_role=updatedData.project_role,
      stakholder.influence=updatedData.influence,
      stakholder.impact=updatedData.impact,
      stakholder.support=updatedData.support,
      stakholder.matrix=updatedData.matrix,
      stakholder.engage_stakeholder=updatedData.engage_stakeholder,
      stakholder.decision_maker=updatedData.decision_maker,
      stakholder.communication_frequency=updatedData.communication_frequency,
      stakholder.ways_of_communication=updatedData.ways_of_communication,
      // ... other fields you want to update
  
      // Save the updated stakholder
      await stakholderRepository.save(stakholder);
  
      console.log(`Stakeholder with ID ${stakholderId} updated successfully`);
      
      // Optionally, you can return the updated stakholder
      return stakholder;
    } catch (error) {
      console.error(`Error updating stakeholder: ${error.message}`);
      throw error; // Rethrow the error to allow for further handling
    }
  };

const getStakHoldersByProjectId = async (projectId) => {
  try {
      // Assuming there's a 'projectstakholder' table/entity in your database
      // This example assumes you're using TypeORM, adjust accordingly for your ORM or repository
      const projectStakeholders = await projectstakholderRepository.find({
          where: { projectId },
          relations: ['stakholder'], // Assuming there's a relation between 'projectstakholder' and 'stakholder'
      });

      // Filter out only stakeholders where isDeleted is false
      const activeStakeholders = projectStakeholders
          .filter((projectStakholder) => projectStakholder.stakholder.isDeleted === false)
          .map((projectStakholder) => projectStakholder.stakholder);

      console.log(activeStakeholders, "Active project stakeholders");

      return activeStakeholders;
  } catch (error) {
      console.error('Error finding stakeholders by project ID:', error);
      throw error; // Rethrow the error to allow for further handling
  }
};


module.exports = {
    createStakHolder,
    getStakHolders,
    getStakHoldersById,
    deleteStakHoldersById,
    updateStakHoldersById,
    getStakHoldersByProjectId
   
    
  };