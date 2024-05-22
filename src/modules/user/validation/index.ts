import z from 'zod';
// import { ValidationHelper } from '../../../utils/helpers';

// const { editstringCheck, dateCheck } = ValidationHelper;

export const createUserValidator = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  country: z.string(),
  phone_number: z.string(),
  referral_code: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export const taskValidator = z.object({
  name: z.string(),
});

export const loginValidator = z.object({
  email: z.string(),
  password: z.string(),
  token: z.string().optional(),
});

export type loginValidatorType = typeof loginValidator._type;
export type TaskSchema = typeof taskValidator._type;
