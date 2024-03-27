const amqp = require('amqplib');
const logger = require('../config/logger');
const configs = require('../config/config');
const userService = require('../services/user.service');
const roleService = require('../services/role.service');
const clientService = require('../services/client.service');
const projectBudgetService = require('../services/projectBudget.service');
async function ConsumeFromRabbit(routingKeys = []) {
  const rabbitmqUrl = configs.rabbitmqUrl;
  const connection = await amqp.connect(rabbitmqUrl);
  const exchange = 'ProjectExchange';
  const options = {};

  let channel = await connection.createChannel();
  logger.info('wating for data......');

  logger.info(routingKeys);

  await channel.assertExchange(exchange, 'topic', options);
  const { queue } = await channel.assertQueue('', options);
  routingKeys.forEach((routingK) => {
    channel.bindQueue(queue, exchange, routingK);
  });
  channel.consume(queue, (data) => {
    if (data.fields.routingKey.includes('user') && data.fields.routingKey.includes('create')) {
      userService.createUser(JSON.parse(data.content.toString()));
    } else if (data.fields.routingKey.includes('user') && data.fields.routingKey.includes('update')) {
      userService.updateUser(JSON.parse(data.content.toString()));
    } else if (data.fields.routingKey.includes('project_budget')  && data.fields.routingKey.includes('createOrupdate') ) {
      projectBudgetService.updateOrCreateProjectBudget(data.content.toString());
    } else if (data.fields.routingKey.includes('role') && data.fields.routingKey.includes('create')) {
      let roleData = {};
      roleData.id = JSON.parse(data.content.toString()).id;
      roleData.roleName = JSON.parse(data.content.toString()).role_name;
      roleData.isProjectRole = JSON.parse(data.content.toString()).isProjectRole;
      roleData.createdAt = JSON.parse(data.content.toString()).created_at;
      roleData.updatedAt = JSON.parse(data.content.toString()).updated_at;
      console.log(roleData,"role testttttt");
      roleService.createRole(roleData);
     } else if (data.fields.routingKey.includes('client') && data.fields.routingKey.includes('create')) {
      let clientData = {};
      clientData.id = JSON.parse(data.content.toString()).id;
      clientData.clientName = JSON.parse(data.content.toString()).client_name;
      clientData.postalCode = JSON.parse(data.content.toString()).postal_code;
      clientData.address = JSON.parse(data.content.toString()).address;
      clientData.telephone = JSON.parse(data.content.toString()).telephone;
      clientData.createdAt = JSON.parse(data.content.toString()).created_at;
      clientData.updatedAt = JSON.parse(data.content.toString()).updated_at;
      console.log(clientData,"client testttttt");
      clientService.createClient(clientData);
     }
    channel.ack(data, false, true);
  });
}

module.exports = ConsumeFromRabbit;
