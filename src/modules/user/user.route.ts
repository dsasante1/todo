import express from 'express';
import { UserController } from './user.controller';

const { createAccount, login } = UserController;

const Router = express.Router();

Router.post('/', createAccount);
Router.post('/login', login);

export const userRouter = Router;
