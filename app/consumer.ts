import rabbit from 'amqplib';
import eventEmitter from 'events'

import { processTranslation } from './util/process_translation';

class OopsEmitter extends eventEmitter { }
const oopsEmitter = new OopsEmitter()

import { config } from './config/index';

const queue = config.rabbit_mq.queues.subtitle;

async function main() {
    const connectionString = `amqp://${config.rabbit_mq.user}:${config.rabbit_mq.pass}@${config.rabbit_mq.host}:${config.rabbit_mq.port}`;
    console.log('connectionString', connectionString)

    console.log('RabbitMQ connected successfully');
    try {
        const connection = await rabbit.connect(connectionString);
        const channel = await connection.createChannel();
        channel.assertQueue(queue, {
            durable: true
        })
        await channel.consume(queue, message => {
            if (message !== null) {
                oopsEmitter.emit('event', message.content.toString())
                console.log(" [x] Received %s", message.content.toString());
                const formattedMessage = JSON.parse(message.content.toString());
                processTranslation(formattedMessage)
                channel.ack(message)
            }
        })

    } catch (err) {
        console.log('error from queue', err)
    }

};

main()
