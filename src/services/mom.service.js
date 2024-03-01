const httpStatus = require('http-status');
const { Mom, momAttendees, MomAction, momActionResponsible, momAgenda, momAgendaTopic, momComment, User, momAbsents } = require('../models');
const dataSource = require('../utils/createDatabaseConnection');
const ApiError = require('../utils/ApiError');
const sortBy = require('../utils/sorter');
const findAll = require('./Plugins/findAll');
const { all } = require('../routes/v1');

const momRepository = dataSource.getRepository(Mom).extend({
  findAll,
  sortBy,
});
const momCommentRepository = dataSource.getRepository(momComment);

const momAttendeesRepository = dataSource.getRepository(momAttendees);
const momAbsentsRepository = dataSource.getRepository(momAbsents);
const momActionRepository = dataSource.getRepository(MomAction);
const momActionResponsibleRepository = dataSource.getRepository(momActionResponsible);
const momAgendaRepository = dataSource.getRepository(momAgenda);
const momAgendaTopicRepository = dataSource.getRepository(momAgendaTopic);
const userRepository = dataSource.getRepository(User);

/**
 * @module MOM
 */
/**
 * This function creates and saves the Minutes of Meeting (MOM) along with attendees, absentees, action items, and agenda topics.
 * @function
 * @param {Object} momBody - The main body of the MOM (Minutes of Meeting).
 * @param {Array<Object>} Attendees - An array of attendees' data.
 * @param {Array<Object>} Absents - An array of absentees' data.
 * @param {Array<Object>} Action - An array of action items.
 * @param {Array<Object>} Agenda - An array of agenda topics.
 * @throws {Error} Throws an error if there's an issue creating or saving the MOM.
 * @returns {Promise<Object>} - A promise that resolves to the saved MOM.
 */
const createMom = async (momBody, Attendees, Absents, Action, Agenda) => {
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
  }
  if (Absents) {
    const momInstances = [];
    for (const eachAbsents of Absents) {
      if (eachAbsents.userId !== null && eachAbsents.userId !== '') {
        const createdAbsents = momAbsentsRepository.create({
          momId: mom.id,
          userId: eachAbsents.userId,
        });

        const savedAbsents = await momAbsentsRepository.save(createdAbsents);
        momInstances.push(savedAbsents);
      }
    }
    //  return momInstances;
  }


  if (Action) {
    const actionInstances = [];

    for (const eachAction of Action) {
      const responsiblePersons = eachAction.responsiblePersonId || [];

      const actionInstance = momActionRepository.create({
        momId: mom.id,
        action: eachAction.action,
        deadline: eachAction.deadline,
      });

      const savedActionInstance = await momActionRepository.save(actionInstance);
      if (eachAction.responsiblePersonId !== null && eachAction.responsiblePersonId !== '') {
        const responsiblePersonInstance = momActionResponsibleRepository.create({
          userId: eachAction.responsiblePersonId,
          momActionId: savedActionInstance.id,
        });

        await momActionResponsibleRepository.save(responsiblePersonInstance);
      }
      actionInstances.push(savedActionInstance);

    }

    console.log(actionInstances, "actionInstances")
    mom.action = actionInstances;
  }

  if (Agenda) {
    const agendaInstance = [];
    for (const eachAgenda of Agenda) {

      const agendaTopics = eachAgenda.agendaTopics || [];

      const agendaInstance = momAgendaRepository.create({
        momId: mom.id,
        agenda: eachAgenda.agenda,
      });
      const savedAgendaInstance = await momAgendaRepository.save(agendaInstance);


      for (const agendaTopic of agendaTopics) {
        if (agendaTopic.userId == "") {
          const agendaTopicInstance = momAgendaTopicRepository.create({
            agendaId: savedAgendaInstance.id,
            agendaPoints: agendaTopic.agendaPoints,
            otherUser: agendaTopic.otherUser
          });
          const savedAgendaTopics = await momAgendaTopicRepository.save(agendaTopicInstance);
        } else {
          const agendaTopicInstance = momAgendaTopicRepository.create({
            agendaId: savedAgendaInstance.id,
            agendaPoints: agendaTopic.agendaPoints,
            userId: agendaTopic.userId
          });
          const savedAgendaTopics = await momAgendaTopicRepository.save(agendaTopicInstance);
        }

      }
    }
  }

  return mom;
};
/**
 * Retrieves MOMs (Minutes of Meeting) based on provided filter criteria and options.
 *
 * @function
 * @param {Object} filter - The filter criteria.
 * @param {Object} options - Additional options.
 * @property {number} options.limit - The maximum number of results to return.
 * @property {number} options.page - The page number for pagination.
 * @property {string} options.sortBy - The field to sort the results by.
 * @throws {Error} Throws an error if there's an issue retrieving MOMs.
 * @returns {Promise<Array>} - A promise that resolves to an array of MOMs.
 */
const getMoms = async (filter, options) => {
  const { limit, page, sortBy } = options;
  return await momRepository.findAll({
    tableName: 'moms',
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};
/**
 * Retrieves a MOM (Minutes of Meeting) by its unique ID.
 *
 * @function
 * @param {string} momId - The ID of the MOM.
 * @throws {Error} Throws an error if there's an issue retrieving the MOM.
 * @returns {Promise<Object>} - A promise that resolves to the retrieved MOM.
 */
const getMom = async (momId) => {
  return await momRepository.findOne({
    where: { id: momId },
    relations: ['facilitator', 'momAttendees', 'momAgenda.momTopics', 'momAction', 'momComment', 'momAbsents', 'momAction', 'momAction.momActionResponsible.user'],
  },
  );
};
/**
 * This function retrieves Minutes of Meeting (MOMs) grouped by project based on the specified filter criteria and additional options.
 * @function
 * @param {Object} filter - The filter criteria.
 * @param {Object} options - Additional options.
 * @property {number} options.limit - The maximum number of results to return.
 * @property {number} options.page - The page number for pagination.
 * @property {string} options.sortBy - The field to sort the results by.
 * @throws {Error} Throws an error if there's an issue retrieving MOMs grouped by project.
 * @returns {Promise<Array>} - A promise that resolves to an array of grouped MOM results.
 */
const groupMOMByProject = async (filter, options) => {
  const groupedResults = await momRepository
    .createQueryBuilder('mom')
    .leftJoinAndSelect('mom.project', 'project')
    .select([
      'mom.projectId AS projectId',
      'project.createdAt AS createdAt',
      'project.updatedAt AS updatedAt',
      'project.createdBy AS createdBy',
      'project.updatedBy AS updatedBy',
      'project.name AS name',
      'project.clientId AS clientId',
      'project.milestone AS _milestone',
      'project.budget AS budget',
      'project.contract_sign_date AS contract_sign_date',
      'project.planned_end_date AS planned_end_date',
      'project.lc_opening_date AS lc_opening_date',
      'project.advanced_payment_date AS advanced_payment_date',
      'project.status AS status',
      'json_agg(mom.*) AS MOM',
    ])
    .groupBy('mom.projectId, project.id, project.name')
    .getRawMany();

  return groupedResults;
};
/**
 * Retrieves MOMs (Minutes of Meeting) associated with a specific project ID.
 *
 * @function
 * @param {string} projectId - The ID of the project.
 * @throws {Error} Throws an error if there's an issue retrieving MOMs.
 * @returns {Promise<Array>} - A promise that resolves to an array of MOMs.
 */
const getByProject = async (projectId) => {
  return await momRepository.findBy({ projectId: projectId });
}
/**
 * This function allows you to update a Minutes of Meeting (MOM) based on its unique ID. You can modify the MOM body, update attendees, absents, external attendees, action items, and agenda topics.
 * @function
 * @param {string} momId - The ID of the MOM (Minutes of Meeting).
 * @param {Object} momBody - The update data for the MOM.
 * @param {Array<Object>} attendees - An array of attendees' data.
 * @param {Array<Object>} absents - An array of absentees' data.
 * @param {Array<Object>} externalAttendees - An array of external attendees' data.
 * @param {Array<Object>} action - An array of action items.
 * @param {Array<Object>} agenda - An array of agenda topics.
 * @throws {Error} Throws an error if there's an issue updating the MOM.
 * @returns {Promise<Object>} - A promise that resolves to the updated MOM.
 */
const updateMom = async (momId, momBody, attendees, absents, action, agenda) => {
  console.log(momBody, "externalAttendees")
  if (Object.keys(momBody).length > 0) {
    await momRepository.update(momId, momBody);
    const updatedMom = await momRepository.findOneBy({ id: momId });
  }


  if (attendees) {

    //  remove all attendees
    for (const eachAttendees of attendees) {
      const momAttendees = await momAttendeesRepository.findBy({ momId: momId });
      await momAttendeesRepository.remove(momAttendees);
    }

    //add attendees to again to update mom attendees
    const momInstances = attendees.map((eachAttendees) => {
      return momAttendeesRepository.create({
        momId: momId,
        userId: eachAttendees.id,
      });
    });
    await momAttendeesRepository.save(momInstances);
  }

  if (absents) {

    //  remove all attendees

    const momAbsent = await momAbsentsRepository.findBy({ momId: momId });

    await momAbsentsRepository.remove(momAbsent);


    //add attendees to again to update mom attendees
    const momInstances = absents.map((eachAbsents) => {

      return momAbsentsRepository.create({
        momId: momId,
        userId: eachAbsents.id,
      });
    });

    await momAbsentsRepository.save(momInstances);
  }


  if (action) {

    const updatedActions = [];
    for (const eachAction of action) {
      const responsiblePersons = eachAction.responsiblePersonId || [];


      if (eachAction.id) {
        // Update existing record
        const updatedAction = await momActionRepository.update(eachAction.id, {
          action: eachAction.action,
          deadline: eachAction.deadline
        });

        updatedActions.push(updatedAction);
        if (eachAction.momActionResponsible.length !== 0) {
          for (const eachResponsible of eachAction.momActionResponsible) {
            if (eachResponsible.id) {
              const updatedResponsiblePerson = await momActionResponsibleRepository.update(eachResponsible, {
                momActionId: eachAction.id,
                userId: eachResponsible.userId
              })

            }
            else {
              const createdResponsiblePerson = momActionResponsibleRepository.create({
                momActionId: eachAction.id,
                userId: eachResponsible.userId,
              })
              await momActionResponsibleRepository.save(createdResponsiblePerson)

            }
          }

        }


      } else {
        // Create new record
        const actionInstance = momActionRepository.create({
          momId: momId,
          action: eachAction.action,
          deadline: eachAction.deadline
        });
        const createdAction = await momActionRepository.save(actionInstance);

        if (eachAction.momActionResponsible.length !== 0) {
          for (const eachResponsible of eachAction.momActionResponsible) {
            if (eachResponsible.id) {
              const updatedResponsiblePerson = momActionResponsibleRepository.update(eachResponsible, eachResponsible)

            }
            else {

              const createdResponsiblePerson = momActionResponsibleRepository.create({
                momActionId: createdAction.id,
                userId: eachResponsible.userId,
              })
              await momActionResponsibleRepository.save(createdResponsiblePerson)

            }
          }

        }
        updatedActions.push(createdAction);
      }
    }
  }

  if (agenda) {

    for (const eachAgenda of agenda) {
      const agendaTopics = eachAgenda.momTopics || [];
      if (eachAgenda.id) {

        // Update existing record
        const updateAgenda = await momAgendaRepository.update(eachAgenda.id, {
          agenda: eachAgenda.agenda,
        });
        for (const agendaTopic of agendaTopics) {
          if (agendaTopic.id) {
            const updateAgendaTopic = await momAgendaTopicRepository.update(agendaTopic.id, {
              agendaPoints: agendaTopic.agendaPoints,
              userId: agendaTopic.userId,

            });
          }
          else {
            const CreatedAgendaTopic = momAgendaTopicRepository.create({
              agendaPoints: agendaTopic.agendaPoints,
              userId: agendaTopic.userId,
              agendaId: eachAgenda.id
            });
            await momAgendaTopicRepository.save(CreatedAgendaTopic);

          }
        }


      }
      else {
        // Create new record
        const agendaInstance = momAgendaRepository.create({
          momId: momId,
          agenda: eachAgenda.agenda,
        });
        const savedAgendaInstance = await momAgendaRepository.save(agendaInstance);

        for (const agendaTopic of agendaTopics) {

          if (agendaTopic.userId == "" || agendaTopic.userId == null) {
            const agendaTopicInstance = momAgendaTopicRepository.create({
              agendaId: savedAgendaInstance.id,
              agendaPoints: agendaTopic.agendaPoints,
              otherUser: agendaTopic.otherUser
            });
            const savedAgendaTopics = await momAgendaTopicRepository.save(agendaTopicInstance);
          } else {
            const agendaTopicInstance = momAgendaTopicRepository.create({
              agendaId: savedAgendaInstance.id,
              agendaPoints: agendaTopic.agendaPoints,
              userId: agendaTopic.userId
            });
            const savedAgendaTopics = await momAgendaTopicRepository.save(agendaTopicInstance);
          }

        }

      }
    }
  }


  const mom = await getMom(momId)
  //console.log(mom, "danananannananan")
  return mom;
};
/**
 * This function allows you to delete a Minutes of Meeting (MOM) based on its unique ID.
 * @function
 * @param {string} momId - The ID of the MOM (Minutes of Meeting).
 * @throws {Error} Throws an error if the MOM is not found.
 * @returns {Promise<Object>} - A promise that resolves when the MOM is successfully deleted.
 */
const deleteMom = async (momId) => {
  const mom = await getMom(momId);
  if (!mom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mom not found');
  }
  return await momRepository.delete({ id: momId });
};
/**
 * The function allows you to add a comment to a Minutes of Meeting (MOM) based on the provided MOM ID, user ID, comment, and mentioned user ID.
 * @function
 * @param {Object} momBody - The main body of the MOM (Minutes of Meeting).
 * @property {string} momBody.id - The ID of the MOM.
 * @property {string} momBody.userId - The ID of the user adding the comment.
 * @property {string} momBody.comment - The comment to be added.
 * @property {string} momBody.mentionedId - The ID of any mentioned user.
 * @throws {Error} Throws an error if there's an issue creating or saving the comment.
 * @returns {Promise<Object>} - A promise that resolves to the saved MOM comment.
 */

const addComment = async (momBody) => {
  const momComment = momCommentRepository.create({
    momId: momBody.id,
    userId: momBody.userId,
    comment: momBody.comment,
    mentionedId: momBody.mentionedId,
  });

  const savedComment = await momCommentRepository.save(momComment);
  const sender = await userRepository.findOne({
    where: {
      id: savedComment.userId
    }
  }
  );

  savedComment.user = sender;
  return savedComment;
}
/**
 * The function retrieves all comments associated with a specific MOM ID, ordered by creation date.
 * @function
 * @param {string} momId - The ID of the MOM (Minutes of Meeting).
 * @throws {Error} Throws an error if there's an issue retrieving the comments.
 * @returns {Promise<Array>} - A promise that resolves to an array of MOM comments.
 */
const getComments = async (momId) => {

  return await momCommentRepository.find(
    {
      where: { momId: momId, },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    }
  );
}

module.exports = {
  createMom,
  getMoms,
  getMom,
  getByProject,
  updateMom,
  deleteMom,
  addComment,
  getComments,
  groupMOMByProject
};
