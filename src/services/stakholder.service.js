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
/**
 * @module Stakholder
 */
/**
 * Creates a stakeholder asynchronously.
 * @function
 * @param {Object} stakholderBody - The stakeholder data to be created.
 * @param {number} stakholderBody.project_id - The ID of the associated project.
 * @param {string} stakholderBody.title - The title of the stakeholder.
 * @param {string} stakholderBody.remark - Additional remarks about the stakeholder.
 * @param {string} stakholderBody.email - The email address of the stakeholder.
 * @param {string} stakholderBody.phone_number - The phone number of the stakeholder.
 * @param {string} stakholderBody.stakeholder_name - The name of the stakeholder.
 * @param {string} stakholderBody.project_role - The role of the stakeholder in the project.
 * @param {string} stakholderBody.influence - The level of influence of the stakeholder (e.g., 'Low', 'High').
 * @param {string} stakholderBody.impact - The impact of the stakeholder (e.g., 'Low', 'High').
 * @param {string} stakholderBody.support - The type of support provided by the stakeholder.
 * @param {string} stakholderBody.engage_stakeholder - The stakeholder's engagement level.
 * @param {boolean} stakholderBody.decision_maker - Indicates whether the stakeholder is a decision maker.
 * @param {string} stakholderBody.communication_frequency - The frequency of communication with the stakeholder.
 * @param {string} stakholderBody.ways_of_communication - The preferred ways of communication with the stakeholder.
 * @returns {Promise<Object>} - A promise that resolves to the saved stakeholder.
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
        remark: stakholderBody.remark,
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

/**
 * Retrieves stakeholders asynchronously.
 * @function
 * @returns {Promise<Object[]>} - A promise that resolves to an array of stakeholders.
 */
const getStakHolders = async () => {
    return await stakholderRepository.find({
      where: { isDeleted: false }
    }); // Assuming there is a find function in your repository to retrieve all stakeholders
  };
/**
 * Retrieves a stakeholder asynchronously based on the provided ID.
 * @function
 * @param {number} stakholderId - The ID of the stakeholder to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the found stakeholder or null if not found.
 */
  const getStakHoldersById = async (stakholderId) => {
    return await stakholderRepository.findOne({
      where: { id: stakholderId, isDeleted: false}
    });
  };
/**
 * Soft deletes a stakeholder asynchronously based on the provided ID.
 * @function
 * @param {number} stakeholderId - The ID of the stakeholder to delete.
 * @throws {Error} If the stakeholder with the given ID is not found or is already deleted.
 * @returns {Promise<{ success: boolean, message: string }>} - A promise that resolves with an object indicating success and a message.
 */
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
/**
 * Updates a stakeholder asynchronously based on the provided ID.
 * @function
 * @param {number} stakholderId - The ID of the stakeholder to update.
 * @param {Object} updatedData - The updated stakeholder data.
 * @param {string} updatedData.stakeholder_name - The updated stakeholder name.
 * @param {string} updatedData.email - The updated email address.
 * @param {string} updatedData.remark - Additional remarks about the stakeholder.
 * @param {string} updatedData.title - The updated title.
 * @param {string} updatedData.phone_number - The updated phone number.
 * @param {string} updatedData.project_role - The updated role in the project.
 * @param {string} updatedData.influence - The updated level of influence (e.g., 'Low', 'High').
 * @param {string} updatedData.impact - The updated impact (e.g., 'Low', 'High').
 * @param {string} updatedData.support - The updated type of support provided.
 * @param {string} updatedData.matrix - The updated matrix value.
 * @param {string} updatedData.engage_stakeholder - The updated engagement level.
 * @param {boolean} updatedData.decision_maker - Indicates whether the stakeholder is a decision maker.
 * @param {string} updatedData.communication_frequency - The updated frequency of communication.
 * @param {string} updatedData.ways_of_communication - The updated preferred ways of communication.
 * @returns {Promise<Object>} - A promise that resolves to the updated stakeholder.
 * @throws {Error} If the stakeholder with the given ID is not found or is already deleted.
 */
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
      stakholder.remark = updatedData.remark;
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
/**
 * Retrieves active stakeholders asynchronously based on the provided project ID.
 * @function
 * @param {number} projectId - The ID of the project to retrieve stakeholders for.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of active stakeholders.
 * @throws {Error} If there's an error while retrieving stakeholders.
 */
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
