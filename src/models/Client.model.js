const { EntitySchema } = require('typeorm');
//const { Base } = require('./BaseModel');



class Client{
    // Define additional properties specific to AAA entity
    constructor() {
       // super(); // Call the constructor of the Base entity to inherit its properties
        this.id = { primary: true, type: 'uuid', generated: 'uuid' };
        this.clientName = { type: 'varchar' };
        this.postalCode = { type: 'varchar', nullable: true };
        this.address = { type: 'varchar', nullable: true };
        this.telephone = { type: 'varchar' };

        this.isdeleted = { type: 'smallint', nullable: true};

        this.createdAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
        this.updatedAt = { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' };
        this.createdBy = { type: 'varchar' , nullable: true};
        this.updatedBy = { type: 'varchar', nullable: true};
      }

    }


module.exports = new EntitySchema({
    name: 'Client',
    tableName: 'clients',
    columns: new Client(),
    relations: {
        project: {
            type: "one-to-many",
            target: "Project",
            inverseSide: "Client",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }

      },
});

