const { EntitySchema } = require('typeorm');

const momActionResponsible = new EntitySchema({
  name: 'MomActionResponsible',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    userId: {
      type: 'uuid',
      primary: true,
    },
    momActionId: {
      type: 'uuid',
      primary: true,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
    },
    momAction: {
      type: 'many-to-one',
      target: 'momAction',
    },
  },
});

module.exports = momActionResponsible;
