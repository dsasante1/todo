import path from 'path';
import development from './development';
import test from './test';

import production from './production';
import { configDotenv } from 'dotenv';
configDotenv();

const defaults = {
  API_ROOT: path.normalize(`${__dirname}/..`),
  NODE_ENV: process.env.TODO_NODE_ENV,
  PORT: process.env.TODO_PORT,
  DATABASE_URL: process.env.TODO_DEV_DB_URL,
  TODO_SECRET: process.env.TODO_SECRET,
};

const config = {
  development: { ...defaults, ...development },
  test: { ...defaults, ...test },
  production: { ...defaults, ...production },
}[process.env.TODO_NODE_ENV || 'development'];

export default config;
