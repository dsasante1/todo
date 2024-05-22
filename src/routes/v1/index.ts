import express from 'express';

import { userRouter } from '../../modules/user/user.route';


const appRouter = express.Router();

appRouter.use('/user', userRouter);


export const Router = appRouter;
