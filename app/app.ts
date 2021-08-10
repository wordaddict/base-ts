import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { config } from './config';
import { router } from './routes/index'

// service locator via dependency injection
import { serviceLocate } from './config/di'

export const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = config.server.port

app.use('/', router)
app.get('/', ( req: express.Request, res: express.Response) => {
  res.send('Welcome to Translator API!')
})

// Connect to rabbitmq
serviceLocate.get('rabbitmq');

// Connect to elasticsearch
serviceLocate.get('elasticsearch');

// Connect to redis
serviceLocate.get('redis');

// Connect to logger
const logger = serviceLocate.get('logger');

app.listen(port, () => {
  logger.info(`${config.appName} is listening on port: ${port}`)
});
