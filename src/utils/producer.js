const amqp = require('amqplib');
var channel, connection; //global variables
const logger = require('../config/logger');

async function publishToRabbit(routingKey, data) {
  try {
    connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    let exchange = 'ProjectExchange';

    await channel.assertExchange(exchange, 'topic', {});
    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), {});

    logger.info(`Published data to queue with ${routingKey} key`);
    await channel.close();
    await connection.close();
  } catch (error) {
    
    logger.error(`Error occured while trying to publish to queue`);
    console.log(error);
  }
}

module.exports = publishToRabbit;
