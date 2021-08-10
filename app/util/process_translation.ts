const specialChar = ['!', '-', '.'];

import { fetchTranslationPromise, sendEmail } from '../services';
import { QueuePublishData, Locale } from '../types';

export const processTranslation = async (params: QueuePublishData) => {
    console.log('input', params);
    const {
        data,
        email,
        source,
        target
    } = params;

    const finalRecords = [];
    for (const subbtitleLines of data) {
        let finalString = '';

        // split the string by closing character so to fornat the string the timestamp
        const rec = subbtitleLines.split(']');
        finalString = finalString + rec[0] + ']' + ' ';

        const formatedSubtitleTimestamp = finalString.substring(2); // remove the first two characters in the string for clean up
        if (!rec[1]) {
            continue;
        }
        const wholeString = rec[1].trim() // remove white space from the string and last element

        const translatedWholeString = await translateTheWholeString(formatedSubtitleTimestamp, wholeString, source, target)
        if (translatedWholeString !== null) {
            finalRecords.push(translatedWholeString);
        } else {
            const translatedEachWord = await translateEachWordInTheString(formatedSubtitleTimestamp, wholeString, source, target);
            finalRecords.push(translatedEachWord);
        }
    }

    sendEmail(finalRecords, email);

    console.log('finalRecords', finalRecords);
    return finalRecords;
}

// backtracting and recursion to remove special characters at the end of a string
export const checkIfAStringLast = (word: string, removedSubString: string): string[] => {
    console.log('checkIfAStringLast', word, removedSubString)
    if (!specialChar.includes(word[word.length - 1])) {
        console.log('checkIfAStringLast2', [word, removedSubString])
        return [word, removedSubString]
    }
    const lastChar = word[word.length - 1];
    word = word.substring(0, word.length - 1);
    return checkIfAStringLast(word, lastChar + removedSubString)
}

// translate the whole string
export const translateTheWholeString = async (timestamp: string, wholeString: string, source: Locale, target: Locale) => {
    console.log('translateTheWholeString', timestamp, wholeString, source, target)
    let finalString;

    wholeString = wholeString.trim().slice(0, -1) // remove white space from the string and last element
    const checkString = checkIfAStringLast(wholeString, '')
    const paramssec = {
        sourceLanguage: source,
        targetLanguage: target,
        word: checkString[0]
    }

    const response = await fetchTranslationPromise(paramssec);
    if (response.data.translated) {
        finalString = timestamp + response.data.word;
        finalString = checkString[1].length !== 0 ? finalString + checkString[1] : finalString;
        console.log('translateTheWholeString2', finalString)
        return finalString;
    } else {
        return null;
    }

}

export const translateEachWordInTheString = async (timestamp: string, wholeString: string, source: Locale, target: Locale) => {
    console.log('translateEachWordInTheString', timestamp, wholeString, source, target)
    let finalString = timestamp;
    const words = wholeString.split(' '); // split each words by space
    for (let word of words) {
        if (!word) {
            continue;
        }
        // check if words have specialChar at the end
        const checkData = checkIfAStringLast(word, '');
        word = checkData[0];
        if (!word) {
            finalString = finalString + checkData[1] + ' '
            continue;
        }
        // get translation
        const params = {
            sourceLanguage: source,
            targetLanguage: target,
            word: word
        }

        const response = await fetchTranslationPromise(params);
        if (!response.error && !specialChar.includes(word)) {
            finalString = finalString + response.data.word + checkData[1] + ' ';
        } else {
            finalString = finalString + word + checkData[1] + ' ';
        }
    }
    console.log('translateEachWordInTheString2', finalString)
    return finalString;
}
