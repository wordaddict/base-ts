import { RabbitMQHelper } from '../lib/rabbitMQHelper'

import { config } from '../config';
import { QueuePublishData } from '../types';

import winston from 'winston';
import { Channel } from 'amqplib'

export class SubtitleRepository {
  public logger: winston.Logger
  subtitleAMQPPublisherChannel: Promise<Channel>
  publishData: RabbitMQHelper;
  /**
   *
   * @param {*} logger Logger Object
   * @param {*} subtitleAMQPPublisherChannel subtitleAMQPPublisherChannel Object
   */
  constructor(logger: winston.Logger, subtitleAMQPPublisherChannel: Promise<Channel>) {
    this.logger = logger
    this.publishData = new RabbitMQHelper(subtitleAMQPPublisherChannel)
  }

  sendDataToRabbitMQ(data: QueuePublishData): Promise<unknown> {
    return this.publishData.publish(config.rabbit_mq.queues.subtitle, data);
  }

}
