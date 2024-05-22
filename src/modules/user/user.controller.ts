import { NextFunction, Request, Response } from 'express';
import { ResponseHandler } from '../../utils/helpers';
import { StatusCodes } from 'http-status-codes';
import Deasyncify from 'deasyncify';
import { ApiError } from '../../utils/errors';
import Logger from '../../config/logger';
import { ResponseMessages } from './responseMessages';
import { UserServices } from './user.service';
// import { FetchUsersSchema } from './validation';

const userServices = new UserServices();

const {
  USER_CREATED,
  USER_UPDATED_SUCCESSFULLY,
  USER_UPDATE_FAILURE,
  // USERS_FETCHED,
  EMAIL_ALREADY_EXIST,
  INVALID_CREDENTIALS,
  // USER_NOT_FOUND,
} = ResponseMessages;

const { createUser, login, editUserProfile, retrieveUserByEmail } =
  userServices;

/**
 * Contains controller methods for the UserEntity
 * @class UserController
 */
export class UserController {
  static async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);

      const { data } = req.body;

      const user = await retrieveUserByEmail(data.email);

      if (user) {
        if (user.email === data.email && user.is_verified === false) {
          return ApiError.appError(
            {
              code: StatusCodes.BAD_REQUEST,
              message: 'Email already exists but has not been verified',
            },
            req,
            res,
            next,
          );
        }
        if (user.email === data.email) {
          return ApiError.appError(
            {
              code: StatusCodes.BAD_REQUEST,
              message: EMAIL_ALREADY_EXIST,
            },
            req,
            res,
            next,
          );
        }
      }

      const result: any = await createUser({ ...data });

      return response.success({
        message: USER_CREATED,
        code: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred while creating user account in UserController::createAccount',
        error,
      );
      throw error;
    }
  }

  static async editUserProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = new ResponseHandler(req, res);
      const {
        id,
        first_name,
        last_name,
        user_name,
        phone_number,
        dob,
        gender,
        image_url,
        address,
        country,
      } = req.body;
      const user = await editUserProfile({
        id,
        first_name,
        last_name,
        user_name,
        phone_number,
        dob,
        gender,
        image_url,
        address,
        country,
      });
      if (!user) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: USER_UPDATE_FAILURE,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: USER_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: user,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred getting user info in UserController::editUserInfo',
      );
      throw error;
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      // await loginValidator.parseAsync(req.body);
      const [result, error] = await Deasyncify.watch(login(req.body));
      const user = await retrieveUserByEmail(req.body.email);
      if (!user || !user.email) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: 'Email does not exist, create an account',
          },
          req,
          res,
          next,
        );
      }
      if (user.status === 'disabled') {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: 'Your account has been disabled, contact support',
          },
          req,
          res,
          next,
        );
      }
      if (error) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: INVALID_CREDENTIALS,
          },
          req,
          res,
          next,
        );
      }
      return response.success({
        message: 'Logged in successfully',
        code: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred while logging admin in, in UserController::login',
        error,
      );
      throw error;
    }
  }
}
