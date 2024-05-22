import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.interface';
import * as jwt from 'jsonwebtoken';
import UserQueries from './queries';
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

const { createUser, fetchUserByEmail } = UserQueries;

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
    const salt = await bcrypt.genSalt(Number(Env.get('TODO_SALT_ROUNDS')));
    const hashPassword = await bcrypt.hash(data.password, salt);

    const result = await sqlQuest.any(createUser, {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashPassword,
    });

    const token: string = jwt.sign(
      {
        id: result.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      },
      config?.TODO_SECRET as string,
      {
        expiresIn: '3h',
        algorithm: 'HS256',
      },
    );

    return {
      id: result.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
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
}
