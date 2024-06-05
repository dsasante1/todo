import { TasksEntity } from './entities/tasks.entity';
import TasksQueries from './queries';
import {
  TasksType,
  EditTaskPriority,
  EditTaskStatus,
  FetchTask,
  DeleteTask,
  UpdateTasksType,
} from '../tasks/types/tasks.type';
import { sqlQuest } from '../../config/database';
import // TaskSchema,
'./validation/index';
import Logger from '../../config/logger';

const {
  createTask,
  findTaskById,
  updateTask,
  fetchTasks,
  searchTasks,
  deleteTask,
  updatePriority,
  updateTaskStatus,
} = TasksQueries;

/**
 * @class TasksServices
 * Collection of service methods for the TasksEntity
 */
export class TasksServices {
  /**
   * Add task account
   * @memberof TasksServices
   * @param {data} userData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async createTasks(data: TasksType): Promise<TasksEntity> {
    const task = await sqlQuest.any(createTask, {
      user_id: data.id,
      task: data.task,
      priority: data.priority || 0,
    });

    return task;
  }

  async updateTasks(data: UpdateTasksType): Promise<TasksEntity> {
    const task = await sqlQuest.oneOrNone(updateTask, [
      data.id,
      data.user_id,
      data.task,
      data.priority,
    ]);

    return task;
  }
  /**
   * find task by id
   * @memberof TasksServices
   * @param {data} userData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async findTaskById(id: string): Promise<TasksEntity> {
    const task = await sqlQuest.any(findTaskById, {
      task: id,
    });

    return {
      id: task.id,
      task: task.task,
      priority: task.priority,
      completed: task.completed,
    };
  }

  /**
   * Edit task priority
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async editTaskPriority(task: EditTaskPriority): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(updatePriority, [
      task.id,
      task.user_id,
      task.priority,
    ]);
  }

  /**
   * Edit task status
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async toggleTaskCompletion(task: EditTaskStatus): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(updateTaskStatus, [
      task.id,
      task.user_id,
      task.task_status,
    ]);
  }

  /**
   * Fetch task
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async fetchTask(task: FetchTask): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(findTaskById, [task.id, task.user_id]);
  }

  /**
   * Fetch tasks
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async fetchTasks(task: FetchTask): Promise<TasksEntity> {
    return sqlQuest.manyOrNone(fetchTasks, [task.user_id]);
  }

  /**
   * Delete tasks
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async deleteTask(task: DeleteTask): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(deleteTask, [task.id, task.user_id]);
  }

  /**
   * Search tasks
   * @memberof TasksServices
   * @param priority: number,
   * @param completed: boolean,
   * @param all: string,
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */

  async searchTasks(
    user_id?: number,
    priority?: number,
    completed?: boolean,
  ): Promise<any> {
    // const conditions: string[] = [];
    // const queryParams: {
    //   priority?: number;
    //   completed?: boolean;
    //   all?: string;
    // } = {};

    if (priority) {
      const priorityQuery = `SELECT *
      FROM tasks
      WHERE user_id = $1 AND priority = $2`;
      Logger.info(
        `Fetching all tasks with filter - ${JSON.stringify(priority)}`,
      );
      return sqlQuest.manyOrNone(priorityQuery, [user_id, priority]);
    } else if (completed) {
      const completedQuery = `SELECT *
      FROM tasks
      WHERE user_id = $1 AND completed = $2`;
      Logger.info(
        `Fetching all tasks with filter - ${JSON.stringify(completed)}`,
      );
      return sqlQuest.manyOrNone(completedQuery, [user_id, completed]);
    } else if (completed && priority) {
      const completedQuery = `SELECT *
      FROM tasks
      WHERE user_id = $1 AND completed = $2 AND priority = $3`;
      Logger.info(
        `Fetching all tasks with filter - ${JSON.stringify(completed)}`,
      );
      return sqlQuest.manyOrNone(completedQuery, [
        user_id,
        completed,
        priority,
      ]);
    } else {
      return sqlQuest.manyOrNone(searchTasks, [user_id]);
    }
  }
}
