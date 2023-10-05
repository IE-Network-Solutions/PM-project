const amqp = require("amqplib");
const logger = require('../config/logger');
const userService = require('../services/user.service')
async function ConsumeFromRabbit(routingKeys = []) {

  const rabbitmqUrl = "amqp://localhost:5672";
  const connection = await amqp.connect(rabbitmqUrl);
  const exchange = "ProjectExchange";
  const options = {};

  let channel = await connection.createChannel();
  logger.info("wating for data......")

  logger.info(routingKeys)

  await channel.assertExchange(exchange, "topic", options);
  const { queue } = await channel.assertQueue("", options);
  routingKeys.forEach((routingK) => {
    channel.bindQueue(queue, exchange, routingK);
  })
  channel.consume(queue, (data) => {
    if (data.fields.routingKey.includes('user') && data.fields.routingKey.includes('create')) {
      userService.createUser(JSON.parse(data.content.toString()))
    }
    else if (data.fields.routingKey.includes('user') && data.fields.routingKey.includes('update')) {
      userService.updateUser(JSON.parse(data.content.toString()))

    }

    channel.ack(data, false, true);
  });
}


module.exports = ConsumeFromRabbit