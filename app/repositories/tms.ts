import { v4 as uuidv4 } from 'uuid';
import { SearchParams, SearchResponse } from 'elasticsearch';

import { ValidationData, LanguageTranslatorCheckProps } from '../types'
import winston from 'winston';
import redis from 'redis';
import elasticsearch from 'elasticsearch';

export class TMSRepository {
  public logger: winston.Logger
  public elasticsearch: elasticsearch.Client
  public redis: redis.RedisClient
  /**
   *
   * @param {*} logger Logger Object
   * @param {*} elasticsearch elasticsearch Object
   * @param {*} redis redis Object
   */
  constructor(logger: winston.Logger, elasticsearch: elasticsearch.Client, redis: redis.RedisClient) {
    this.logger = logger
    this.elasticsearch = elasticsearch
    this.redis = redis;
  }

  saveTranslation(data: ValidationData) {
    return this.elasticsearch.create({
      index: data.sourceLanguage,
      type: data.targetLanguage,
      id: uuidv4(),
      body: {
        source: data.source,
        target: data.target
      }
    })
  }

  checkTranslation(data: LanguageTranslatorCheckProps): Promise<SearchResponse<ValidationData>> {
    return this.elasticsearch.search({
      index: data.sourceLanguage,
      type: data.targetLanguage,
      body: {
        query: {
          fuzzy: {
            "source.keyword": {
              value: data.word,
              fuzziness: "AUTO:1,6",
              max_expansions: 50,
              prefix_length: 0,
              transpositions: true,
              rewrite: "constant_score"
            }
          }
        }
      }
    } as SearchParams)
  }

  addTranslationToRedis(data: ValidationData) {
    const concatenatedKey = `${data.source}-${data.sourceLanguage}-${data.targetLanguage}`
    return this.redis.setAsync(concatenatedKey, data.target)
  }

  getTranslationFromRedis(data: LanguageTranslatorCheckProps) {
    const concatenatedKey = `${data.word}-${data.sourceLanguage}-${data.targetLanguage}`
    return this.redis.getAsync(concatenatedKey);
  }

}
