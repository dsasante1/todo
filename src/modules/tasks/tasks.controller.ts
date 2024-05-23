import { NextFunction, Request, Response } from 'express';
import { ResponseHandler } from '../../utils/helpers';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../utils/errors';
import Logger from '../../config/logger';
import { ResponseMessages } from './responseMessages';
import { TasksServices } from './tasks.service';
// import { FetchUsersSchema } from './validation';

const userServices = new TasksServices();

const {
  TASK_CREATED,
  CREATE_TASK_FAILED,
  TASK_UPDATED_SUCCESSFULLY,
  TASK_UPDATE_FAILED,
  TASKS_FETCHED,
  TASKS_NOT_FOUND,
  TASK_DELETED,
  TASK_DELETED_FAIL,
} = ResponseMessages;

const {
  createTasks,
  editTaskPriority,
  toggleTaskCompletion,
  fetchTasks,
  fetchTask,
  deleteTask,
  searchTasks,
  updateTasks,
} = userServices;

/**
 * Contains controller methods for the UserEntity
 * @class UserController
 */
export class TasksController {
  static async createNewTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);

      const { task, priority } = req.body;
      const id = req.data.id;

      const result: any = await createTasks({ id, task, priority });

      if (!result) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: CREATE_TASK_FAILED,
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_CREATED,
        code: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred while creating a task in TasksController::createNewTask',
        error,
      );
      throw error;
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);

      const { id, task, priority } = req.body;
      const user_id = req.data.id;

      const result: any = await updateTasks({
        id,
        user_id,
        task,
        priority,
      });

      if (!result) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASK_UPDATE_FAILED,
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: result,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred while updating a task in TasksController::updateTask',
        error,
      );
      throw error;
    }
  }

  static async editPriority(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id, priority } = req.body;
      const user_id = req.data.id;
      const task = await editTaskPriority({
        id,
        user_id,
        priority,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASK_UPDATE_FAILED,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred changing task priority in UserController::editTaskpriority',
      );
      throw error;
    }
  }

  static async editTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id, task_status } = req.body;
      const user_id = req.data.id;
      const task = await toggleTaskCompletion({
        id,
        user_id,
        task_status,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASK_UPDATE_FAILED,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred changing task status in UserController::editTaskpriority',
      );
      throw error;
    }
  }

  static async editTaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id, task_status } = req.body;
      const user_id = req.data.id;
      const task = await toggleTaskCompletion({
        id,
        user_id,
        task_status,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASK_UPDATE_FAILED,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred changing task status in UserController::editTaskStatus',
      );
      throw error;
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id } = req.body;
      const user_id = req.data.id;
      const task = await deleteTask({
        id,
        user_id,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASK_DELETED_FAIL,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASK_DELETED,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred deleting task in UserController::deleteTask',
      );
      throw error;
    }
  }

  static async fetchTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id } = req.body;
      const user_id = req.data.id;
      const task = await fetchTask({
        id,
        user_id,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASKS_NOT_FOUND,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASKS_FETCHED,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred fetching task in UserController::fetchTask',
      );
      throw error;
    }
  }

  static async fetchTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);
      const { id } = req.body;
      const user_id = req.data.id;
      const task = await fetchTasks({
        id,
        user_id,
      });
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASKS_NOT_FOUND,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASKS_FETCHED,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred fetching task in UserController::fetchTask',
      );
      throw error;
    }
  }
  static async searchTask(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ResponseHandler(req, res);

      const { priority, completed } = req.query as unknown as {
        priority: number;
        completed: boolean;
        all: string;
      };
      const user_id = req.data.id;
      const task = await searchTasks(user_id, priority, completed);
      if (!task) {
        return ApiError.appError(
          {
            code: StatusCodes.BAD_REQUEST,
            message: TASKS_NOT_FOUND,
            details: [],
          },
          req,
          res,
          next,
        );
      }

      return response.success({
        message: TASKS_FETCHED,
        code: StatusCodes.OK,
        data: task,
      });
    } catch (error) {
      Logger.error(
        'Error: An error occurred searching task in UserController::searchTask',
      );
      throw error;
    }
  }
}
