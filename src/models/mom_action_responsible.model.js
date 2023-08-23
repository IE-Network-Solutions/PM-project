const { EntitySchema } = require("typeorm");

const momActionResponsible = new EntitySchema({
  name: "MomActionResponsible",
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    userId: {
      type: "uuid",
    },
     momActionId: {
      type: "uuid",
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
