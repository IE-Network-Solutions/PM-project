const amqp = require("amqplib");
const logger = require('../config/logger');

async function ConsumeFromRabbit(routingKey) {

    const rabbitmqUrl = "amqp://localhost:5672";
    const connection = await amqp.connect(rabbitmqUrl);
    const exchange = "ProjectExchange";
    const options = {};



    let channel = await connection.createChannel();
    logger.info("wating for data......")

    logger.info(routingKey)

    await channel.assertExchange(exchange, "topic", options);
    const { queue } = await channel.assertQueue("", options);
    channel.bindQueue(queue, exchange, routingKey);
    channel.consume(queue, (data) => {
        console.log("dataaaaaaaaaaa")
      console.log("Received", JSON.parse(data.content.toString()));
      channel.ack(data, false, true);
    });
}


module.exports=ConsumeFromRabbit