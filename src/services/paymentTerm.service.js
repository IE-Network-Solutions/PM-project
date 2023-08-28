const httpStatus = require('http-status');
const { paymentTerm, Milestone} = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');

const paymentTermRepository = dataSource.getRepository(paymentTerm).extend({
  findAll,
  sortBy,
});

const miletoneRepository = dataSource.getRepository(Milestone);

/**
 * Create a user
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */

const createPaymentTerm = async (paymentTermBody, milestone) => {
    const paymentTerm = paymentTermRepository.create(paymentTermBody);
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
    return paymentTerm;
  };
  





/**
 * Query for users
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getPaymentTerms = async (filter, options) => {
  const { limit, page, sortBy } = options;

  return await paymentTermRepository.find({
    tableName: 'payment_term',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
    relations: ['milestone'],
  });
};


/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getPaymentTerm = async (id) => {
  return await paymentTermRepository.findOne({
      where: { id: id},
      relations: ['milestone'],
    },
    );
};

const getByProject = async (projectId) => {
  return await paymentTermRepository.findBy({ projectId: projectId,});
};

/**
 * Update user by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updatePaymentTerm = async (paymentTermId, updateBody, requestedMilestone) => {
  const paymentTerm = await getPaymentTerm(paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment term not found');
  }

  const paymentTermMilestone = await miletoneRepository.findBy({paymentTermId: paymentTermId});
    if (paymentTermMilestone) {
      const milestoneToRemove = paymentTermMilestone.map((eachMilestone) => {
        return {
          id: eachMilestone.id,
          paymentTermId: null,
        };
      });
      const updatedPaymentTermMilestone = await miletoneRepository.save(milestoneToRemove);
    }

    if (requestedMilestone) {
      const milestonetoUpdate = requestedMilestone.map((eachMilestone) => {
        return {
          id: eachMilestone.id,
          paymentTermId: paymentTerm.id,
        };
      });
      await miletoneRepository.save(milestonetoUpdate);
    }

   await getPaymentTerm(paymentTermId); 

   return paymentTerm;

};

/**
 * Delete user by id
 * @param {ObjectId} ProjectId
 * @returns {Promise<User>}
 */
const deletePaymentTerm = async (paymentTermId) => {
  const paymentTerm = await getPaymentTerm(paymentTermId);


    await miletoneRepository.update(
      { paymentTermId: paymentTermId },
      { paymentTermId: null } 
    );

  await paymentTermRepository.delete({ id: paymentTermId });

  return paymentTerm;
};

module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  getByProject,
  updatePaymentTerm,
  deletePaymentTerm,
};
