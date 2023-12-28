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
 * Create a user
 * @param {Object} momBody
 * @returns {Promise<Mom>}
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
    const momInstances = Absents.map((eachAbsents) => {
      return momAbsentsRepository.create({
        momId: mom.id,
        userId: eachAbsents.userId,
      });
    });

    // Save the mom instances
    console.log(momInstances, "momInstances")
    await momAbsentsRepository.save(momInstances);
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

      for (const responsiblePerson of responsiblePersons) {
        if (responsiblePerson.id) {
          const responsiblePersonInstance = momActionResponsibleRepository.create({
            userId: responsiblePerson.id,
            momActionId: savedActionInstance.id,
          });

          await momActionResponsibleRepository.save(responsiblePersonInstance);
        }

        actionInstances.push(savedActionInstance);
      }
    }


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
    sortOptions: sortBy && { option: sortBy },
    paginationOptions: { limit: limit, page: page },
  });
};

/**
 * Get post by id
 * @param {ObjectId} id
 * @returns {Promise<Mom>}
 */
const getMom = async (momId) => {
  return await momRepository.findOne({
    where: { id: momId },
    relations: ['facilitator', 'momAttendees', 'momAgenda.momTopics', 'momAction', 'momComment', 'momAbsents'],
  },
  );
};

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

const getByProject = async (projectId) => {
  return await momRepository.findBy({ projectId: projectId });
}


/**
 * Update user by id
 * @param {ObjectId} momId
 * @param {Object} updateBody
 * @returns {Promise<Mom>}
 */
const updateMom = async (momId, momBody, attendees, absents, externalAttendees, action, agenda) => {

  const mom = await momRepository.findOneBy({ id: momId });

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
        momId: mom.id,
        userId: eachAttendees.userId,
      });
    });
    await momAttendeesRepository.save(momInstances);
  }

  if (absents) {

    //  remove all attendees
    for (const eachAbsents of absents) {
      const momAbsent = await momAbsentsRepository.findBy({ momId: momId });
      await momAbsentsRepository.remove(momAbsent);
    }

    //add attendees to again to update mom attendees
    const momInstances = absents.map((eachAbsents) => {
      return momAbsentsRepository.create({
        momId: mom.id,
        userId: eachAbsents.userId,
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
      } else {
        // Create new record
        const actionInstance = momActionRepository.create({
          momId: momId,
          action: eachAction.action,
          deadline: eachAction.deadline
        });
        const createdAction = await momActionRepository.save(actionInstance);
        updatedActions.push(createdAction);
      }
    }
  }

  if (agenda) {
    for (const eachAgenda of agenda) {
      const agendaTopics = eachAgenda.agendaTopics || [];
      if (eachAgenda.id) {
        // Update existing record
        const updateAgenda = await momAgendaRepository.update(eachAgenda.id, {
          agenda: eachAgenda.agenda,
        });
      }
      else {
        // Create new record
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
  }

  return mom;
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
