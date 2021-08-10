import { strict as assert } from 'assert';

import { processTranslation, checkIfAStringLast, translateTheWholeString, translateEachWordInTheString } from '../util/process_translation';

describe('Test process translation', () => {
    it('should test checkIfAStringLast', () => {
        const response = checkIfAStringLast('Nooo, my precious!!.', '');
        assert.deepEqual(response, ['Nooo, my precious', '!!.']);
    })

    it('should test translateTheWholeString', async () => {
        const response = await translateTheWholeString('[00:00:12.00 - 00:01:20.00]', "I am Arwen - I've come to help you.", 'en', 'de');
        assert.deepEqual(response, '[00:00:12.00 - 00:01:20.00]Ich bin Arwen - Ich bin gekommen, um dir zu helfen');
    })

    it('should test translateEachWordInTheString', async () => {
        const response = await translateEachWordInTheString('[00:00:12.00 - 00:01:20.00]', "Hello world", 'en', 'de');
        assert.deepEqual(response, '[00:00:12.00 - 00:01:20.00]Hallo Welt ');
    })

    it('should test processTranslation', async () => {
        const response = await processTranslation({
            data: ['1 [00:00:12.00 - 00:01:20.00] Hello world'],
            email: 'test@gmail.com',
            source: 'en',
            target: 'de'
        });
        assert.deepEqual(response, ['[00:00:12.00 - 00:01:20.00] Hallo Welt']);
    })
})