// imported modules
import { success, failure } from '../lib/response_manager';
import { HTTPStatus } from '../constants/http_status';
import { formatSubtitles } from '../services/subtitle';
import { Locale } from '../types'

import express from 'express';
import winston from 'winston';
import { SubtitleRepository } from '../repositories'

export class SubtitleController {
    public logger: winston.Logger
    public subtitleRepo: SubtitleRepository
    /**
     *
     * @param {*} logger Logger Object
     * @param {*} subtitleRepo subtitleRepo Object
     */
    constructor(logger: winston.Logger, subtitleRepo: SubtitleRepository) {
        this.logger = logger
        this.subtitleRepo = subtitleRepo
    }

    async addSubtitle(req: express.Request, res: express.Response) {
        if (!req.file) {
            return failure(
                res,
                { message: 'Kindly upload subtitle' },
                HTTPStatus.BAD_REQUEST
            )
        }

        const { email, sourceLanguage, targetLanguage }: { email: string, sourceLanguage: Locale, targetLanguage: Locale } = req.body;
        if (!email || !sourceLanguage || !targetLanguage) {
            return failure(
                res,
                {
                    message: `Validation error: email, sourceLanguage and targetLanguage must be added to the request body`,
                },
                HTTPStatus.BAD_REQUEST
            )
        }

        try {
            // formats the array by reading the file line by line
            const dataArray = formatSubtitles(req.file.path);
            const params = {
                data: dataArray,
                email,
                source: sourceLanguage,
                target: targetLanguage
            }

            // pushes the data to the queue
            await this.subtitleRepo.sendDataToRabbitMQ(params);
            return success(
                res,
                {
                    message: 'subtitle added successfully',
                },
                HTTPStatus.OK
            )
        } catch (e) {
            this.logger.error('Error from adding file', e);
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
