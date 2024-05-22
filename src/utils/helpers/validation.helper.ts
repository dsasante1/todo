import { z } from 'zod';

export class ValidationHelper {
  /**
   * Checks the validity of a required string
   */
  static stringCheck = (min = 1) => {
    return z.string().min(min);
  };

  /**
   * Checks the validity of a required number
   */
  static numberCheck = (min = 1) => {
    return z.number().min(min);
  };

  /**
   * Checks the validity of an optional string
   */
  static editstringCheck = () => {
    return z.string().nullable().optional();
  };

  /**
   * Checks the validity of an optional number
   */
  static editnumberCheck = () => {
    return z.number().nullable();
  };

  /**
   * Checks the validity of a required email
   */
  static singlEmailCheck = (min = 1, find: any) => {
    return z
      .string()
      .min(min, { message: 'This field has to be filled.' })
      .email('This is not a valid email.')
      .refine(async (e) => {
        const entity = await find(e);
        return !entity;
      }, 'This email is already taken!');
  };

  /**
   * Checks the validity of a required email
   */
  static bulkEmailCheck = (min = 1) => {
    return z
      .string()
      .min(min, { message: 'This field has to be filled.' })
      .email('This is not a valid email.');
  };

  /**
   * Checks the validity of a required email
   */
  static phoneCheck = (min = 10, max = 14) => {
    return z
      .string()
      .min(min, { message: 'Must be a valid mobile number' })
      .max(max, { message: 'Must be a valid mobile number' });
  };

  /**
   * Checks the validity of an optional date
   */
  static dateCheck = () => {
    return z.date().nullable().optional();
  };
}
