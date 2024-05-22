import { configDotenv } from 'dotenv';
configDotenv();

const development = {
  NODE_ENV: process.env.TODO_NODE_ENV,
  PORT: process.env.TODO_PORT,
  DATABASE_URL: process.env.TODO_DEV_DB_URL,
  TODO_CLIENT_URL: process.env.TODO_CLIENT_URL,
};

export default development;
