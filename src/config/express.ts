import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Router, routeBase } from '../routes';
import { ApiError } from '../utils/errors';
import config from './env';

export default function App(): Express {
  const app = express();
  const developmentCorsUrls = ['*'];

  const corsUrls = [
    ...(config?.NODE_ENV === 'production' ? [] : developmentCorsUrls),
    config?.TODO_CLIENT_URL as string,
  ];
  const corsOptions = {
    origin: corsUrls,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.disable('x-powered-by');
  app.use(routeBase.V1_PATH, Router);
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

  // Handles exceptions thrown in the application
  app.use(ApiError.appError);

  // handle all error instances and returns an errors response
  // eslint-disable-next-line no-unused-vars
  app.use(ApiError.genericError);

  return app;
}
