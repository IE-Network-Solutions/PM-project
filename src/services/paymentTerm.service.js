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
      console.log(miletoneRepository);
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


/**
 * Update user by id
 * @param {ObjectId} projectId
 * @param {Object} updateBody
 * @returns {Promise<Project>}
 */
const updatePaymentTerm = async (paymentTermId, updateBody) => {
  const paymentTerm = await getPaymentTerm(paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment term not found');
  }
  await paymentTermRepository.update({ id: paymentTermId }, updateBody);
  return await getPaymentTerm(paymentTermId); 
};

/**
 * Delete user by id
 * @param {ObjectId} ProjectId
 * @returns {Promise<User>}
 */
const deletePaymentTerm = async (paymentTermId) => {
  const paymentTerm = await getPaymentTerm(paymentTermId);
  if (!paymentTerm) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment Term not found');
  }
  return await paymentTermRepository.delete({ id: paymentTermId });
};

module.exports = {
  createPaymentTerm,
  getPaymentTerms,
  getPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm,
};
