import { LanguageTranslatorCheckProps } from '../types'

import { config } from '../config';

import rabbit_mq from 'amqplib';

export const pushToQueue = async (params: LanguageTranslatorCheckProps) => {
    const q = config.rabbit_mq.queues.error_queue;
    const open = rabbit_mq.connect(`amqp://${config.rabbit_mq.user}:${config.rabbit_mq.pass}@${config.rabbit_mq.host}:${config.rabbit_mq.port}`);

    open.then(function (conn: rabbit_mq.Connection) {
        return conn.createChannel();
    }).then(async function (ch: rabbit_mq.Channel) {
        await ch.assertQueue(q);
        return ch.sendToQueue(q, Buffer.from(JSON.stringify(params)));
    }).catch(console.warn);
}
