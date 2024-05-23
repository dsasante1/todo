export type TasksType = {
  id: string;
  task: string;
  priority?: number;
};

export type UpdateTasksType = {
  id: number;
  user_id: string;
  task: string;
  priority?: number;
};

export type EditTaskPriority = {
  id: number;
  user_id: string;
  priority: number;
};

export type EditTaskStatus = {
  id: number;
  user_id: string;
  task_status: boolean;
};

export type FetchTask = {
  id?: number;
  user_id: string;
};

export type DeleteTask = {
  id: number;
  user_id: string;
};

export type SearchTask = {
  id: number;
  user_id: string;
};
