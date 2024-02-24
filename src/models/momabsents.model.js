const { EntitySchema } = require("typeorm");

const momAbsents = new EntitySchema({
    name: "momAbsents",
    columns: {
        userId: {
            type: "uuid",
            primary: true,
        },
        momId: {
            type: "uuid",
            primary: true,
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
        },
        mom: {
            type: 'many-to-one',
            target: 'minuteOfMeeting',
            onDelete: 'CASCADE',
        },
    },
});

module.exports = momAbsents;
