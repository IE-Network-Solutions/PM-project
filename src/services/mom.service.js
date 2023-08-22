const httpStatus = require('http-status');
const { Mom, momAttendees,Action,momActionResponsible } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { all } = require('../routes/v1');

const momRepository = dataSource.getRepository(Mom).extend({
  findAll,
  sortBy,
});

const momAttendeesRepository = dataSource.getRepository(momAttendees);
const momActionRepository = dataSource.getRepository(Action);
const momActionResponsibleRepository = dataSource.getRepository(momActionResponsible);

// const taskRepository = dataSource.getRepository(Task).extend({
//   findAll,
//   sortBy,
// });
// const subTaskRepository = dataSource.getRepository(Subtask).extend({
//   findAll,
//   sortBy,
// });

// .extend({ sortBy });
//

/**
 * Create a user
 * @param {Object} momBody
 * @returns {Promise<Mom>}
 */
const createMom = async (momBody, Attendees, Action, Agenda) => {
 
  const mom = momRepository.create(momBody);

  // Save the mom
  await momRepository.save(mom);

  if (Attendees) { 
    const momInstances = Attendees.map((eachAttendees) => {
      return momAttendeesRepository.create({
        momId: mom.id,
        userId: eachAttendees.userId,
      });
    });
      // Save the mom instances
      await momAttendeesRepository.save(momInstances);

      if (Action) {
        const actionInstances = Action.map(async (eachAction) => {
          const responsiblePersonId = eachAction.responsiblePersonId || [];
          const actionInstance = momActionRepository.create({
            momId: mom.id,
            action: eachAction.action,
            deadline: eachAction.deadline,
            responsiblePersonId: responsiblePersonId,
          });
    
          const savedActionInstance = await momActionRepository.save(actionInstance);
    
          // Create and save responsible person
          if (responsiblePersonId.length > 0) {
            const responsiblePersonInstance = responsiblePersonId.map((eachResponsiblePersons) => {
              return momActionResponsibleRepository.create({
                userId: eachResponsiblePersons.id,
                momActionId: savedActionInstance.id,
              });
            });
    
             await momActionResponsibleRepository.save(responsiblePersonInstance);
          }
    
          return savedActionInstance;
        });
    
        // Save action instances
        const savedActionInstance = await Promise.all(actionInstances);
        mom.action = savedActionInstance;
      }

      return mom;
  }
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

const getMoms = async (filter, options) => {
  const { limit, page, sortBy } = options;
  return await momRepository.findAll({
    tableName: 'moms',
    sortOptions: sortBy&&{ option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Mom>}
 */
const getMom = async (milestoenId) => {
  return await momRepository.findOneBy({ id: milestoenId });
};


/**
 * Update user by id
 * @param {ObjectId} momId
 * @param {Object} updateBody
 * @returns {Promise<Mom>}
 */
const updateMom = async (momId, updateBody) => {
  const mom = await getMom(momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  await momRepository.update({ id: momId }, updateBody);
  return await getMom(momId);
};

/**
 * Delete user by id
 * @param {ObjectId} milestoenId
 * @returns {Promise<User>}
 */
const deleteMom = async (momId) => {
  const mom = await getMom(momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  return await momRepository.delete({ id: momId });
};

module.exports = {
  createMom,
  getMoms,
  getMom,
  updateMom,
  deleteMom,
};
