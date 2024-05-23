import express from 'express';
import { TasksController } from './tasks.controller';
import { tryCatch } from '../../utils/errors/try.catch.helper';
import { AuthMiddleware } from '../auth/middlewares';

const {
  createNewTask,
  editPriority,
  editTaskStatus,
  deleteTask,
  fetchTasks,
  searchTask,
  updateTask,
} = TasksController;
const { authenticate } = AuthMiddleware;
const Router = express.Router();

Router.use(authenticate);
Router.post('/new', tryCatch(createNewTask));
Router.put('/edit', tryCatch(updateTask));
Router.patch('/priority', tryCatch(editPriority));
Router.patch('/status', tryCatch(editTaskStatus));
Router.delete('/delete', tryCatch(deleteTask));
Router.get('/', tryCatch(fetchTasks));
Router.get('/search', tryCatch(searchTask));

export const tasksRouter = Router;
