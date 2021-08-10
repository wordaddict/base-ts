import fs from 'fs';
import { ValidationData } from '../types'
import { SearchResponse } from 'elasticsearch';

export const formatSubtitles = (filePath: string | Buffer | import("url").URL) => {
    const data = fs.readFileSync(filePath, 'utf8');
    const dataArray = data.split("\n");
    fs.unlinkSync(filePath)
    return dataArray;
};

export const formatSubtitlesToUpload = (payload: ValidationData[]) => {
    const finalPayload = [];
    for (const data of payload) {
        // we want to save the string exactly regardless
        finalPayload.push(data);
        const sourceStringArray = data.source.split(' ');
        const targetStringArray = data.target.split(' ');

        // if the length of the source string and target strings are the same
        // we can go further to assume that each word in source has each translation in target

        if (sourceStringArray.length === targetStringArray.length) {
            for (let i = 0; i < sourceStringArray.length; i++) {
                const newObj = {
                    source: sourceStringArray[i],
                    target: targetStringArray[i],
                    sourceLanguage: data.sourceLanguage,
                    targetLanguage: data.targetLanguage
                } as ValidationData;
                finalPayload.push(newObj)
            }
        }
    }
    return finalPayload;
};


export function queryOutputToResponse(word: string, queryResponse: SearchResponse<ValidationData>): string {
    if (queryResponse.hits.hits.length !== 0) {
        return queryResponse.hits.hits[0]._source.target;
    } else {
        // return the word if translation is not found
        return word;
    }
}