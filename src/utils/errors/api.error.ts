/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ZodError } from 'zod';

import logger from '../../config/logger';

/**
 * @description Applications Error object class
 * Used to format and return error messages
 *
 * @returns  {object} ApiError class
 */
export class ApiError extends Error {
  private readonly code: number;
  private readonly details: number;
  constructor(code: number, message: string, details?: any) {
    super(message);
    // const stack = Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.details = details;
  }

  /**
   * Method to handle intentionally thrown exceptions.
   * @param {object} err express error object
   * @param {object} req express request object
   * @param {object} res express response object
   * @param {function} next express middleware next object
   */
  static appError(err: any, req: Request, res: Response, next: NextFunction) {
    // error code
    let { code, details } = err;

    const status = 'error';

    if (err instanceof ZodError) {
      err: ZodError;
      const { message } = err;
      code = StatusCodes.FORBIDDEN;
      logger.error(`
                Zod validation error error:
                status - ${status}
                message - ${message} 
                url - ${req.originalUrl} 
                method - ${req.method} 
                IP - ${req.ip}
                Error Stack - ${err.stack}
          `);

      const errorMessage: string[] = JSON.parse(message).map(
        (error: { message: string; path: string }) =>
          `${error.path}: ${error.message} \n`,
      );

      return res.status(code).json({
        url: req.originalUrl,
        message: errorMessage.join(' '),
        status,
        type: getReasonPhrase(code),
      });
    } else if (err instanceof ApiError || (code && typeof code === 'number')) {
      logger.error(`
            API error:
            status - error
            message - ${err.message} 
            url - ${req.originalUrl} 
            method - ${req.method} 
            IP - ${req.ip}
            Error Stack - ${err.stack}
          `);

      return res.status(code || 500).json({
        url: req.originalUrl,
        message: err.message,
        status,
        type: getReasonPhrase(code || 500),
        error: details,
      });
    } else {
      next(err);
    }
  }

  /**
   * Generic error response handler of internal and unhandled exceptions.
   *
   * @param  {Object}   err
   * @param  {Object}   req
   * @param  {Object}   res
   */
  static genericError = (err: any, req: Request, res: Response) => {
    const message = 'An error occurred, we are looking into it.';
    const status = 'error';
    const url = req.originalUrl;

    logger.error(`
        Generic error:
        status - ${status}
        message - ${message} 
        url - ${url} 
        method - ${req.method} 
        IP - ${req.ip}
        Error Stack - ${err.stack}
      `);

    return res.status(err.status || 500).json({
      message,
      status,
      url,
      type: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
  };
}
