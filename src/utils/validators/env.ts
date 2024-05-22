import { z } from 'zod';
import { AppEnv } from '../enums';

export interface EnvProps {
  NODE_ENV: string;
  DATABASE_URL: string;
  SWAGGER_ROUTE: string;
  REDIS_SESSION_STORE_URL: string;
  SESSION_SECRET: string;
}

export const envValidatorSchema = z.object({
  NODE_ENV: z.string().default(AppEnv.DEVELOPMENT),

  DATABASE_URL: z.string(),

  REDIS_SESSION_STORE_URL: z.string().optional(),

  SWAGGER_ROUTE: z.string().default('/api/docs'),
  SESSION_SECRET: z.string().optional(),
});
