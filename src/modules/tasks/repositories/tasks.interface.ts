import { TasksEntity } from '../entities/tasks.entity';

export type CreateTasksArgs = Partial<
  Omit<TasksEntity, 'çreated_at' | 'updated_at'>
>;

export interface TasksRepository {
  createTask(task: CreateTasksArgs): Promise<TasksEntity>;
}

export type UpdateTasksArgs = Partial<Omit<TasksEntity, 'created_at'>>;
