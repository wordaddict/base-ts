import { } from 'amqplib'
import { locales } from '../constants/locale'


export type Locale = typeof locales[number]['locale']

export type LanguageTranslatorCheckProps = {
  word: string;
  sourceLanguage: Locale;
  targetLanguage: Locale;
}

export type LanguageTranslatorProps = LanguageTranslatorCheckProps & { source: string }

export type QueuePublishData = {
  data: string[],
  email: string,
  source: Locale,
  target: Locale
}

export type ValidationData = {
  source: string,
  target: string,
  sourceLanguage: Locale,
  targetLanguage: Locale
}


export type TranslationData = {
  word: string;
  translated: boolean;
}

export type HTTPResponse<T> = {
  error: boolean;
  code: number;
  message: string;
  data: T;
}

