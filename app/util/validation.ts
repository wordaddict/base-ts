import { ValidationData } from '../types'
export const validateSubtitlePayload = (payload: ValidationData[]): string[] => {
    const errors: string[] = [];
    for (let data of payload) {
        if (!data.source) {
            errors.push('source')
        };
        if (!data.target) {
            errors.push('target')
        }
        if (!data.sourceLanguage) {
            errors.push('sourceLanguage')
        }
        if (!data.targetLanguage) {
            errors.push('targetLanguage')
        }
    }

    return errors;
}