import { success, failure } from '../lib/response_manager';
import { HTTPStatus } from '../constants/http_status';

import { ValidationData, LanguageTranslatorCheckProps } from '../types'

import { formatSubtitlesToUpload, queryOutputToResponse } from '../services/subtitle'
import { validateSubtitlePayload } from '../util/validation'

import winston from 'winston';
import { TMSRepository } from '../repositories'

import express from 'express';

export class TMSController {
  public logger: winston.Logger
  public tmsRepository: TMSRepository
  /**
   *
   * @param {*} logger Logger Object
   * @param {*} tmsRepository tmsRepository Object
   */
  constructor(logger: winston.Logger, tmsRepository: TMSRepository) {
    this.logger = logger
    this.tmsRepository = tmsRepository
  }

  uploadTranstion(req: express.Request, res: express.Response) {
    const data = req.body;
    const validation = validateSubtitlePayload(data as ValidationData[]);
    if (validation.length > 0) {
      return failure(
        res,
        {
          message: `Validation error, these fields must be present in array: ${validation}`,
        },
        HTTPStatus.BAD_REQUEST
      )
    }
    const formattedData = formatSubtitlesToUpload(data as ValidationData[]);
    for (const record of formattedData) {
      this.tmsRepository.saveTranslation(record as ValidationData);
    }

    return success(
      res,
      {
        message: 'translation saved successfully',
      },
      HTTPStatus.OK
    )
  }

  async getTranstion(req: express.Request, res: express.Response) {
    const { target, source, word } = req.query;
    if (!target || !source || !word) {
      return failure(
        res,
        {
          message: `Validation error: target, source and word must be added to the query parameter`,
        },
        HTTPStatus.BAD_REQUEST
      )
    }

    try {
      const params = {
        word,
        sourceLanguage: source,
        targetLanguage: target
      } as LanguageTranslatorCheckProps;
      // check Redis for translation
      const cachedData = await this.tmsRepository.getTranslationFromRedis(params as LanguageTranslatorCheckProps);
      let formatedQueryResponse: string;
      let translated: boolean;
      if (cachedData !== null) {
        formatedQueryResponse = cachedData;
        translated = true;
      } else {
        const resp = await this.tmsRepository.checkTranslation(params as LanguageTranslatorCheckProps);
        formatedQueryResponse = queryOutputToResponse(word as string, resp);
        translated = formatedQueryResponse !== word ? true : false;

        // check if it was translated before storing data in redis
        if (translated) {
          await this.tmsRepository.addTranslationToRedis({ source: word, sourceLanguage: source, targetLanguage: target, target: formatedQueryResponse } as ValidationData);
        }
      }

      const message = translated === true ? 'translation gotten successfully' : 'translation not found';
      if (!formatedQueryResponse) {
        formatedQueryResponse = String(word);
      }
      return success(
        res,
        {
          message,
          data: {
            response: formatedQueryResponse,
            translated
          }
        },
        HTTPStatus.OK
      )
    } catch (err) {
      this.logger.error('Unable to get translation', err)
      if (err.status === 404) {
        return failure(
          res,
          {
            message: 'translation not found',
            data: {
              response: String(word),
              translated: false
            }
          },
          HTTPStatus.NOT_FOUND
        )
      }
      return failure(
        res,
        {
          message: 'Internal server Error',
        },
        HTTPStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

}