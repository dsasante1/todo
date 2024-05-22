import { TasksEntity } from './entities/tasks.entity';
import TasksQueries from './queries';
import { GenericHelper } from '../../utils/helpers';
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
} = TasksQueries;
const {
  paginateData,
  // hashText,
} = GenericHelper;

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
      id: data.id,
      task: data.task,
      priority_number: data.priority_number || 0,
    });

    return {
      id: task.id,
      task: task.task,
      priority_number: task.priority_number,
      completed: task.completed,
    };
  }

  async updateTasks(data: UpdateTasksType): Promise<TasksEntity> {
    const task = await sqlQuest.any(updateTask, {
      user_id: data.id,
      task: data.task,
      priority_number: data.priority_number,
    });

    return {
      id: task.id,
      task: task.task,
      priority_number: task.priority_number,
      completed: task.completed,
    };
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
      priority_number: task.priority_number,
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
    return sqlQuest.oneOrNone(updateTask, task);
  }

  /**
   * Edit task status
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async toggleTaskCompletion(task: EditTaskStatus): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(updateTask, task);
  }

  /**
   * Fetch tasks
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async fetchTask(task: FetchTask): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(fetchTasks, task);
  }

  /**
   * Delete tasks
   * @memberof TasksServices
   * @param {data} taskData - task data to be added
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */
  async deleteTask(task: DeleteTask): Promise<TasksEntity> {
    return sqlQuest.oneOrNone(deleteTask, task);
  }

  /**
   * Search tasks
   * @memberof TasksServices
   * @param priority_number: number,
   * @param completed: boolean,
   * @param all: string,
   * @returns {Promise<Object>} - Returns a promise that resolves to the task
   * object if the admin exists. Otherwise, it returns null.
   */

  async searchTasks(
    id: number,
    priority_number: number,
    completed: boolean,
    all: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    const conditions: string[] = [];
    const queryParams: {
      priority_number?: number;
      completed?: boolean;
      all?: string;
    } = {};

    const currentPage: number = parseInt(page as any) || 1;
    const pageLimit: number = parseInt(limit as any) || 10;

    if (priority_number) {
      queryParams.priority_number = priority_number;
      conditions.push(`
              (
                transaction_info.transaction_type ILIKE '%' || $/priority_number/ || '%'
              )
          `);
      Logger.info(
        `Fetching all transactions with filter - ${JSON.stringify(
          priority_number,
        )}`,
      );
    }

    if (completed) {
      queryParams.completed = completed;
      conditions.push(`
              (
                transaction_info.completed::text ILIKE '%' || $/completed/ || '%'
              )
          `);
    }
    if (all) {
      queryParams.all = all;
      conditions.push(`
              (
                transaction_info.user_id = $/all/
              )
          `);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const findTransactionsQuery = `${searchTasks} ${whereClause} ORDER BY transaction_info.created_at DESC`;
    const transactions = await paginateData(
      findTransactionsQuery,
      queryParams,
      currentPage,
      pageLimit,
    );
    Logger.info(`Transactions fetched ${JSON.stringify(transactions)}`);
    return transactions;
  }
}
