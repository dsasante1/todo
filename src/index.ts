import http from 'http';
import { Express } from 'express';
import { envValidatorSchema } from './utils/validators/env';
import Env from './utils/env';
import Logger from './config/logger';
import { connectDB } from './config/database';
import App from './config/express';
import { AppEnv } from './utils/enums';

async function main(App: (...args: any[]) => Express) {
  // run the following three before initializing App function
  await Env.validateEnv(envValidatorSchema);
  await connectDB();
  const app = App();

  const server = http.createServer(app);

  const PORT = Env.get<number>('PORT') || 8080;
  const NODE_ENV = Env.get<string>('NODE_ENV');
  Logger.info(`🚀🚀Server started on port ${PORT} ...`);

  NODE_ENV !== AppEnv.PRODUCTION &&
    server.on('listening', () => {
      Logger.info(`listening on http://localhost:${PORT}`);
    });

  server.listen(PORT);
}

main(App);
