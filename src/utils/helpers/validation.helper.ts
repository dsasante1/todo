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
}
