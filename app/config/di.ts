import { config } from './index';
import { serviceLocator } from '../lib/service_locator';

// subtitle services and controllers
import { SubtitleController, TMSController } from '../controllers'
import { SubtitleRepository, TMSRepository } from '../repositories'

import { Utility } from '../lib/Utilities';

import redis from 'redis';
import rabbit from 'amqplib';
import elasticsearch from 'elasticsearch';
import bluebird from 'bluebird';
import winston from 'winston';


// getting types on service locator will take more time
/**
 * Returns an instance of logger
 */

serviceLocator.register('logger', () => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),

    defaultMeta: { service: 'subtitle-service' },
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    ],
  })

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    )
  }
  return logger;
})

/**
   * Returns a Redis connection instance.
   */

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key: string, value: string): Promise<void>;
    getAsync(key: string): Promise<string>;
  }
}
serviceLocator.register('redis', (servicelocator: { get: (arg0: string) => any; }) => {
  const logger = servicelocator.get('logger');
  const oldRedisClient = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.db,
  });
  const redisClient = bluebird.promisifyAll(oldRedisClient) as redis.RedisClient; // cast

  redisClient.on('connect', () => {
    logger.info('Redis is connected');
  });

  redisClient.on('error', (err: any) => {
    logger.error(`Connection error : ${err}`);
    redisClient.quit();
    process.exit(1);
  });

  redisClient.on('end', (err: any) => {
    logger.error(`Redis is shutting down : ${err}`);
    process.exit(1);
  });

  // If the Node process ends, close the Redis connection
  process.on('SIGINT', () => {
    redisClient.quit();
    process.exit(0);
  });

  return redisClient;
});


/**
   * Returns a RabbitMQ connection instance.
   */
serviceLocator.register('rabbitmq', () => {
  const connectionString = `amqp://${config.rabbit_mq.user}:${config.rabbit_mq.pass}@${config.rabbit_mq.host}:${config.rabbit_mq.port}`;
  return rabbit.connect(connectionString).then((connection: any) => {
    console.log('RabbitMQ connected successfully');
    return connection
  });
});


/**
   * Return a channel for publishing to the Subtitle Queue
   */
serviceLocator.register('subtitleAMQPPublisherChannel', (servicelocator: { get: (arg0: string) => any; }) => {
  const rabbitmq = servicelocator.get('rabbitmq');
  const q = config.rabbit_mq.queues.subtitle;
  return rabbitmq.then((connection: { createChannel: () => Promise<rabbit.Channel>; }) => connection.createChannel()
    .then(async (ch) => {
      Utility.amqpChannelCloseEventsHandler(q, ch);
      await ch.assertQueue(q, { durable: true });
      return ch;
    }));
});


/**
   * Return a channel for consuming from the Subtitle Queue
   */
serviceLocator.register('subtitleAMQPConsumerChannel', (servicelocator: { get: (arg0: string) => any; }) => {
  const rabbitmq = servicelocator.get('rabbitmq');
  const q = config.rabbit_mq.queues.subtitle;
  return rabbitmq.then((connection: { createChannel: () => Promise<any>; }) => connection.createChannel()
    .then((ch) => {
      Utility.amqpChannelCloseEventsHandler(q, ch);
      ch.prefetch(1);
      return ch.assertQueue(q, { durable: true, noAck: false }).then(() => ch);
    }));
});

/**
* Returns a Elastic search connection instance.
*/

serviceLocator.register('elasticsearch', () => {
  var client = new elasticsearch.Client({
    host: `${config.elastic_search.host}:${config.elastic_search.port}`,
    log: 'trace',
    apiVersion: '7.2',
  });

  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error: any) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('elasticsearch is connected successfully');
    }
  });
  return client;
})

/**
 * Creates an instance of the subtitle repository
 */
serviceLocator.register('subtitleRepo', (servicelocator: { get: (arg0: string) => any; }) => {
  const logger: winston.Logger = servicelocator.get('logger')
  const subtitlePublisher: Promise<rabbit.Channel> = servicelocator.get('subtitleAMQPPublisherChannel');
  return new SubtitleRepository(logger, subtitlePublisher)
})

/**
 * Creates an instance of the subtitle Controller
 */
serviceLocator.register('subtitleController', (servicelocator: { get: (arg0: string) => any; }) => {
  const logger: winston.Logger = servicelocator.get('logger')
  const subtitleRepo = servicelocator.get('subtitleRepo')
  return new SubtitleController(logger, subtitleRepo)
})

/**
 * Creates an instance of the tms Controller
 */
serviceLocator.register('tmsController', (servicelocator: { get: (arg0: string) => any; }) => {
  const logger: winston.Logger = servicelocator.get('logger')
  const tmsRepository = servicelocator.get('tmsRepository')
  return new TMSController(logger, tmsRepository);
})

/**
 * Creates an instance of the tms repository
 */
serviceLocator.register('tmsRepository', (servicelocator: { get: (arg0: string) => any; }) => {
  const logger: winston.Logger = servicelocator.get('logger')
  const elasticsearch: elasticsearch.Client = servicelocator.get('elasticsearch')
  const redis = servicelocator.get('redis')
  return new TMSRepository(logger, elasticsearch, redis);
})

export const serviceLocate = serviceLocator
