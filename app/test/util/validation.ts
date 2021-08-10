import { validateSubtitlePayload } from '../../util/validation'
import { ValidationData } from '../../types'

import { strict as assert } from 'assert';

const samplePayload = [
    {
        "sourc": "I am Arwen - I've come to help you",
        "target": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
        "sourceLanguage": "en",
        "targetLanguage": "de"
    } as unknown as ValidationData
]

const secondSamplePayload = [
    {
        "sourc": "I am Arwen - I've come to help you",
        "targe": "Ich bin Arwen - Ich bin gekommen, um dir zu helfen",
        "sourceLanguag": "en",
        "targetLanguag": "de"
    } as unknown as ValidationData
]

describe('Test TMS input validation', () => {
    it('should test wrong source input', () => {
        const response = validateSubtitlePayload(samplePayload);
        assert.deepEqual(response, ['source']);
    })

    it('should test total wrong source input', () => {
        const response = validateSubtitlePayload(secondSamplePayload);
        assert.deepEqual(response, ['source', 'target', 'sourceLanguage', 'targetLanguage']);
    })
})