import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository, UpdateUserArgs } from './repositories/user.interface';
import * as jwt from 'jsonwebtoken';
import UserQueries from './queries';
import { GenericHelper } from '../../utils/helpers';
import { UserType } from '.';
import Env from '../../utils/env';
import { sqlQuest } from '../../config/database';
import {
  // TaskSchema,
  loginValidatorType,
} from './validation/index';
import Logger from '../../config/logger';

import { UserModel } from '../../config/database/models/user';
import config from '../../config/env';
import { ApiError } from '../../utils/errors';
import { StatusCodes } from 'http-status-codes';

const { createUser, fetchUserByEmail, updateUserProfile } = UserQueries;
const {
  generateAlId,
  generateRandomCode,
  generateRandomFourDigitNumber,
  // paginateData,
  // hashText,
} = GenericHelper;

/**
 * @class UserServices
 * Collection of service methods for the UserEntity
 */
export class UserServices implements UserRepository {
  /**
   * Add user account
   * @memberof UserServices
   * @param {data} userData - user data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the user
   * object if the admin exists. Otherwise, it returns null.
   */
  async createUser(data: UserType): Promise<UserEntity> {
    const id: string = generateAlId();

    let referral_code;

    if (data.referral_code) {
      referral_code = data.referral_code;
    } else {
      referral_code = `${data.user_name.substring(
        0,
        3,
      )}code${generateRandomCode(2, 5)}`;
    }

    const salt = await bcrypt.genSalt(Number(Env.get('TODO_SALT_ROUNDS')));
    const hashPassword = await bcrypt.hash(data.password, salt);
    const otp: number = generateRandomFourDigitNumber();
    await sqlQuest.any(createUser, {
      id,
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
      email: data.email,
      password: hashPassword,
      salt,
      country: data.country,
      phone_number: data.phone_number,
      referral_code,
      user_otp: otp,
    });

    const token: string = jwt.sign(
      {
        id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        user_name: data.user_name,
      },
      config?.TODO_SECRET as string,
      {
        expiresIn: '3h',
        algorithm: 'HS256',
      },
    );

    return {
      id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      user_name: data.user_name,
      phone_number: data.phone_number,
      referral_code,
      token,
    };
  }

  async retrieveUserByEmail(email: string): Promise<any> {
    const user = await sqlQuest.oneOrNone(fetchUserByEmail, [email]);
    return user;
  }

  async login({ password, email }: loginValidatorType) {
    try {
      const user: UserModel = (await sqlQuest.oneOrNone(fetchUserByEmail, [
        email,
      ])) as UserModel;
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
      }
      if (user?.password && (await bcrypt.compare(password, user.password))) {
        const { id, email, first_name, last_name } = user;
        const token: string = jwt.sign(
          {
            id,
            email,
            first_name,
            last_name,
          },
          config?.TODO_SECRET as string,
          {
            expiresIn: '1d',
            algorithm: 'HS256',
          },
        );
        return {
          id,
          email,
          first_name,
          last_name,
          token,
        };
      }
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Incorrect email or password',
      );
    } catch (error) {
      Logger.error(
        'Error: Error occurred while logging user in, in UserService::login',
        error,
      );
      throw error;
    }
  }

  /**
   * Edit user account
   * @memberof UserServices
   * @param {data} userData - user data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the user
   * object if the admin exists. Otherwise, it returns null.
   */
  async editUserProfile(user: UpdateUserArgs): Promise<UserEntity> {
    return sqlQuest.oneOrNone(updateUserProfile, user);
  }
}
