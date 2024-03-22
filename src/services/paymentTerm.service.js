const httpStatus = require('http-status');
const { paymentTerm, Milestone, Project, ProjectContractValue } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const publishToRabbit = require('../utils/producer');
const { getBudgetType } = require('./budgetType.service');

const paymentTermRepository = dataSource.getRepository(paymentTerm).extend({
  findAll,
  sortBy,
});
const miletoneRepository = dataSource.getRepository(Milestone);
const projectRepository = dataSource.getRepository(Project);
const projectContractValuesRepository = dataSource.getRepository(ProjectContractValue);
/**
 * @module paymentTerm
 */
/**
 * Creates a payment term for a project.
 * @async
 * @function
 * @param {Object} paymentTermBody - The payment term details.
 * @param {number} paymentTermBody.projectId - The unique identifier of the project.
 * @param {number} paymentTermBody.currencyId - The currency identifier.
 * @param {number} paymentTermBody.amount - The payment amount.
 * @param {string} paymentTermBody.name - The name of the payment term.
 * @param {string} paymentTermBody.plannedCollectionDate - The planned collection date.
 * @param {string} paymentTermBody.actualCollectionDate - The actual collection date.
 * @param {number} paymentTermBody.budgetTypeId - The budget type identifier.
 * @param {string} paymentTermBody.status - The status of the payment term.
 * @param {boolean} paymentTermBody.percentage - Indicates if the amount is a percentage.
 * @param {Array} milestone - An array of milestone objects associated with the payment term.
 * @throws {ApiError} Throws an error if saving the payment term fails.
 * @returns {Promise<Object>} The created payment term object.
 */
const createPaymentTerm = async (paymentTermBody, milestone) => {
  const project = await projectRepository.findOne({
    where: {
      id: paymentTermBody.projectId,
    },
    relations: ['projectContractValues'],
  });

  const projectContractValues = await projectContractValuesRepository.findOne({
    where: {
      currencyId: paymentTermBody.currencyId,
    },
  });

  let amount;
  if (paymentTermBody.percentage) {
    amount = (projectContractValues.amount * paymentTermBody.amount) / 100;
  } else {
    amount = paymentTermBody.amount;
  }

  let isOffshore;
  if (paymentTermBody.currencyId == 7) {
    isOffshore = false;
  } else {
    isOffshore = true;
  }

  const paymentTerm = paymentTermRepository.create({
    name: paymentTermBody.name,
    amount: amount,
    projectId: paymentTermBody.projectId,
    plannedCollectionDate: paymentTermBody.plannedCollectionDate,
    actualCollectionDate: paymentTermBody.actualCollectionDate,
    currencyId: paymentTermBody.currencyId,
    budgetTypeId: paymentTermBody.budgetTypeId,
    status: paymentTermBody.status,
    isOffshore: isOffshore,
    isAmountPercent: paymentTermBody.percentage,
  });
    if (paymentTermBody.isAdvance){
    paymentTerm.isAdvance = true;
  }else{
    paymentTerm.isAdvance= false;
  }
  await paymentTermRepository.save(paymentTerm);

  if (milestone) {
    const milestoneInstances = milestone.map((eachMilestone) => {
      return {
        id: eachMilestone.id,
        paymentTermId: paymentTerm.id,
      };
    });
    await miletoneRepository.save(milestoneInstances);
  }

  paymentTerm.milestone = milestone;

  paymentTerm.bugetType = await getBudgetType(paymentTerm.budgetTypeId);
  console.log(paymentTerm.bugetType);
  publishToRabbit('project.paymentTerm', paymentTerm);
  return paymentTerm;
};
/**
 * Retrieves payment terms based on specified filter and options.
 * @async
 * @function
 * @param {Object} filter - The filter criteria for payment terms (if any).
 * @param {Object} options - Additional options for pagination and sorting.
 * @param {number} options.limit - The maximum number of results to return.
 * @param {number} options.page - The page number for pagination.
 * @param {string} options.sortBy - The field to sort the results by.
 * @throws {ApiError} Throws an error if retrieving payment terms fails.
 * @returns {Promise<Array>} An array of payment term objects.
 */
const getPaymentTerms = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await paymentTermRepository.find({
    tableName: 'payment_term',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['milestone'],
  });
};
/**
 * Retrieves a payment term by its unique identifier.
 * @async
 * @function
 * @param {number} id - The unique identifier of the payment term.
 * @throws {ApiError} Throws an error if retrieving the payment term fails.
 * @returns {Promise<Object>} The payment term object.
 */
const getPaymentTerm = async (id) => {
  return await paymentTermRepository.findOne({
    where: { id: id },
    relations: ['milestone'],
  });
};
/**
 * Retrieves payment terms associated with a specific project.
 * @async
 * @function
 * @param {number} projectId - The unique identifier of the project.
 * @throws {ApiError} Throws an error if retrieving payment terms fails.
 * @returns {Promise<Array>} An array of payment term objects.
 */
const getByProject = async (projectId) => {
  const paymentTerm = await paymentTermRepository.find({
    where: { projectId: projectId },
    relations: ['milestone'],
  });
  return paymentTerm;
};
/**
 * Updates a payment term with the specified details.
 * @async
 * @function
 * @param {number} paymentTermId - The unique identifier of the payment term.
 * @param {Object} updateBody - The updated payment term details.
 * @param {string} updateBody.name - The new name for the payment term.
 * @param {number} updateBody.amount - The updated payment amount.
 * @param {string} updateBody.plannedCollectionDate - The updated planned collection date.
 * @param {string} updateBody.actualCollectionDate - The updated actual collection date.
 * @param {number} updateBody.currencyId - The updated currency identifier.
 * @param {number} updateBody.budgetTypeId - The updated budget type identifier.
 * @param {string} updateBody.status - The updated status of the payment term.
 * @param {boolean} updateBody.percentage - Indicates if the updated amount is a percentage.
 * @param {string} updateBody.path - The updated ATP document path.
 * @param {Array} requestedMilestone - An array of milestone objects associated with the payment term.
 * @throws {ApiError} Throws an error if updating the payment term fails.
 * @returns {Promise<Object>} The updated payment term object.
 */
const updatePaymentTerm = async (paymentTermId, updateBody, requestedMilestone) => {
  if (updateBody) {
    //  await paymentTermRepository.update({ id: paymentTermId }, updateBody);
    await paymentTermRepository.update(
      { id: paymentTermId },
      {
        name: updateBody.name,
        amount: updateBody.amount,
        plannedCollectionDate: updateBody.plannedCollectionDate,
        actualCollectionDate: updateBody.actualCollectionDate,
        currencyId: updateBody.currencyId,
        budgetTypeId: updateBody.budgetTypeId,
        status: updateBody.status,
        isAmountPercent: updateBody.percentage,
        atpDocument : updateBody.path,
        milestone : requestedMilestone,
        isAdvance : updateBody.isAdvance,
      }
    );
  }

  const paymentTermMilestone = await miletoneRepository.findBy({ paymentTermId: paymentTermId });

  //Remove all payment term id in milestone table
  if (paymentTermMilestone) {
    const milestoneToRemove = paymentTermMilestone.map((eachMilestone) => {
      return {
        id: eachMilestone.id,
        paymentTermId: null,
      };
    });
    const updatedPaymentTermMilestone = await miletoneRepository.save(milestoneToRemove);
  }

  //add payment term id in milestone table with the updated value
  if (requestedMilestone) {
    const milestonetoUpdate = requestedMilestone.map((eachMilestone) => {
      return {
        id: eachMilestone.id,
        paymentTermId: paymentTermId,
      };
    });

    return requestedMilestone;
    await miletoneRepository.save(milestonetoUpdate);
  }

  await getPaymentTerm(paymentTermId);

  return await paymentTermRepository.findOne({
    where: { id: paymentTermId },
    relations: ['milestone'],
  });
};
/**
 * Deletes a payment term by marking it as deleted.
 * @async
 * @function
 * @param {number} paymentTermId - The unique identifier of the payment term to delete.
 * @throws {ApiError} Throws an error if the payment term does not exist.
 * @returns {Promise<Object>} The deleted payment term object.
 */
const deletePaymentTerm = async (paymentTermId) => {
  const paymentTerm = await getPaymentTerm(paymentTermId);

  await miletoneRepository.update({ paymentTermId: paymentTermId }, { paymentTermId: null });

  await paymentTermRepository.delete({ id: paymentTermId });
  return paymentTerm;
};
/**
 * Sets the variance value for a project contract.
 * @async
 * @function
 * @param {Object} VarianceBody - The variance details.
 * @param {number} VarianceBody.projectId - The unique identifier of the project.
 * @param {number} VarianceBody.currencyId - The currency identifier.
 * @param {number} VarianceBody.amount - The variance amount.
 * @param {string} VarianceBody.name - The name of the variance.
 * @param {string} VarianceBody.date - The date of the variance.
 * @throws {ApiError} Throws an error if setting the variance fails.
 * @returns {Promise<Object>} The created variance object.
 */
const setVariance = async (VarianceBody) => {
  const varianceValue = projectContractValuesRepository.create(VarianceBody);
  const varianceVal = await projectContractValuesRepository.insert(varianceValue);
  return varianceValue;
};
module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
  setVariance,
}
