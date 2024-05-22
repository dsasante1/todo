import express from 'express';
import { UserController } from './user.controller';
import { tryCatch } from '../../utils/errors/try.catch.helper';
import { AuthMiddleware } from '../auth/middlewares';

const {
  createAccount,
  login,
  // sendChangePasswordOtp,
  // resetPassword,
  // changePassword,
} = UserController;
const { authenticate } = AuthMiddleware;
const Router = express.Router();

Router.post('/', createAccount);
Router.post('/login', login);
// Router.post('/forgot-password', tryCatch(sendChangePasswordOtp));
// Router.post('/reset-password', tryCatch(resetPassword));
// Router.patch('/change-password', changePassword);

Router.use(authenticate);

export const userRouter = Router;
