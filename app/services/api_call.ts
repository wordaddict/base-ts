import http from 'http';
import { TranslationData, HTTPResponse } from '../types'

import { config } from '../config';
import { LanguageTranslatorCheckProps } from '../types';


import { pushToQueue } from '../services'

const fetchTranslation = (params: LanguageTranslatorCheckProps, callback: (res: HTTPResponse<TranslationData>) => void) => {
    return http.get(`http://${config.server.baseUrl}:${config.server.port}/translation?target=${params.targetLanguage}&source=${params.sourceLanguage}&word=${params.word}`, (resp) => {

        const { statusCode = 0 } = resp;

        let error;
        let result;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (![200, 404].includes(statusCode)) {
            // push to error queue
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
            pushToQueue(params)
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            resp.resume();
        }

        resp.setEncoding('utf8');
        let rawData = '';
        resp.on('data', (chunk: string) => { rawData += chunk; });


        resp.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                result = parsedData;
                callback(result)
            } catch (e) {
                console.error(e.message);
            }
        });

        return result;
    }).on("error", (err: Error) => {
        console.log("Error making API Call: " + err.message);
    });
}

export const fetchTranslationPromise = (params: LanguageTranslatorCheckProps): Promise<HTTPResponse<TranslationData>> => {
    return new Promise((resolve, reject) => {
        fetchTranslation(params, (data: HTTPResponse<TranslationData>) => {
            return resolve(data);
        })
    })
}
