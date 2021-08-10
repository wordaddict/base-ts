import dotenv from 'dotenv';
dotenv.config()

export interface IRedisConfig {
  host: string;
  port: number;
  db: string;
}

export interface IRabbitMQConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  queues: { subtitle: string, error_queue: string };
}

export interface IElasticSearchConfig {
  host: string;
  port: number;
}


const appName = 'Translator app';

export const config = {
  appName,
  server: {
    baseUrl: process.env.BASE_URL || 'localhost',
    port: process.env.PORT,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0,
  } as IRedisConfig,
  rabbit_mq: {
    host: process.env.RABBIT_HOST || 'localhost',
    port: process.env.RABBIT_PORT || 5672,
    user: process.env.RABBIT_USER || '',
    pass: process.env.RABBIT_PASS || '',
    queues: {
      subtitle: 'test',
      error_queue: 'failure'
    },
  } as IRabbitMQConfig,
  elastic_search: { 
    host: process.env.ELASTIC_HOST || 'localhost',
    port: process.env.ELASTIC_PORT || 9200,
  } as IElasticSearchConfig,
  email: {
    mailAccountUser: process.env.MAIL_USER,
    mailAccountPassword: process.env.MAIL_PASSWORD
  }
}
