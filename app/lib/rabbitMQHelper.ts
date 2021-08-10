import { Channel } from 'amqplib'
import { QueuePublishData } from '../types';

export class RabbitMQHelper {
  myChannel: Channel;
  /**
   *
   * @param {*} channel AMQP channel
   */
  constructor(channel: Promise<Channel>) {
    channel.then((publishChannel: Channel) => {
      return this.myChannel = publishChannel;
    });
  }

  /**
    * Published a message to the defined queue
    *
    * @param queue Queue to publish to
    * @param data Data to publish to queue
    */
  publish(queue: string, data: QueuePublishData) {
    const queueMessage = Buffer.from(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      const response = this.myChannel.sendToQueue(queue, queueMessage);
      resolve(response);
    });
  }
}
