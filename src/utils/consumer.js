const amqp = require('amqplib');
const logger = require('../config/logger');
const userService = require('../services/user.service');
const projectBudgetService = require('../services/projectBudget.service');
async function ConsumeFromRabbit(routingKeys = []) {
  const rabbitmqUrl = 'amqp://localhost:5672';
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
    } else if (data.fields.routingKey.includes('project_budget') && data.fields.routingKey.includes('createOrupdate')) {
      // let projectBudget = {};
      // projectBudget.amount = JSON.parse(data.content.toString()).amount;
      // projectBudget.projectId = JSON.parse(data.content.toString()).project_id;
      // projectBudget.currencyId = JSON.parse(data.content.toString()).currency_id;
      // projectBudget.budgetCategoryId = JSON.parse(data.content.toString()).budget_category_id;
      // console.log(projectBudget);
      projectBudgetService.updateOrCreateProjectBudget(data.content.toString());
    }
    channel.ack(data, false, true);
  });
}

module.exports = ConsumeFromRabbit;
