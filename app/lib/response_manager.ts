import { Response } from 'express'
import { TranslationData } from '../types'

export interface IResponse {
  error: boolean;
  code: number;
  message: string;
  data: TranslationData
}

type Data = {
  response: string;
  translated: boolean
}

type ResponseFormat = {
  data?: Data; message: string; error?: boolean;
}

// type HttpCode = 200 | 201 | 202 | 400 | 404 | 500
//TODO: currently getting an error on the type check, would fix later
function respond(res: Response, data: ResponseFormat, httpCode: number) {
  const response = {
    error: data.error,
    code: httpCode,
    message: data.message,
  } as IResponse
  if (data.data) {
    response.data = {
      word: data.data.response,
      translated: data.data.translated
    }
  }
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Method', '*')

  res.writeHead(httpCode)
  res.end(JSON.stringify(response))
}

export function success(
  res: Response,
  response: { data?: Data; message: string },
  status = 200
) {
  const data = response; (data as ResponseFormat).error = false
  respond(res, data, status)
}

export function failure(
  res: Response,
  response: { data?: Data; message: string },
  httpCode = 503
) {
  const data = response
    ; (data as ResponseFormat).error = true
  respond(res, data, httpCode)
}
