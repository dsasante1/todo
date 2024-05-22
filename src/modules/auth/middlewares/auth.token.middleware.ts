import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../utils/errors';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessages } from '../responseMessages';
import { AuthHelper } from '../helpers';
import Env from '../../../utils/env';

const { AUTH_REQUIRED } = ResponseMessages;
const { verifyToken } = AuthHelper;

class AuthMiddleware {
  /**
   * Checks for token in the authorization and x-access-token header properties.
   * @param {object} authorization - The headers object
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkAuthorizationToken(authorization: any) {
    let bearerToken = null;
    if (authorization) {
      const token = authorization.split(' ')[1];
      bearerToken = token || authorization;
    }
    return bearerToken;
  }

  /**
   * Aggregates a search for the access token in a number of places.
   * @param {Request} req - The express request object.
   * @memberof AuthMiddleware
   * @returns {string | null} - Returns the Token or Null
   */
  static checkToken(req: Request) {
    const {
      headers: { authorization },
    } = req;
    return AuthMiddleware.checkAuthorizationToken(authorization);
  }

  /**
   * Verifies the validity of a user's access token or and the presence of it.
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof AuthMiddleware
   */
  static authenticate(req: Request, res: Response, next: NextFunction) {
    const token = AuthMiddleware.checkToken(req);
    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, AUTH_REQUIRED));
    }
    try {
      const decoded = verifyToken(token, Env.get('CARDUVY_SECRET'));
      req.data = decoded;
      next();
    } catch (error) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, AUTH_REQUIRED));
    }
  }
}

export default AuthMiddleware;
