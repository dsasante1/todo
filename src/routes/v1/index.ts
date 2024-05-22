import express from 'express';

import { userRouter } from '../../modules/user/user.route';
import { tasksRouter } from '../../modules/tasks/tasks.route';

const appRouter = express.Router();

appRouter.use('/user', userRouter);
appRouter.use('/task', tasksRouter);

export const Router = appRouter;
