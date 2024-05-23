export type TasksType = {
  id: string;
  task: string;
  priority?: number;
};

export type UpdateTasksType = {
  id: string;
  user_id: string;
  task: string;
  priority?: number;
};

export type EditTaskPriority = {
  id: string;
  user_id: string;
  priority: string;
};

export type EditTaskStatus = {
  id: string;
  user_id: string;
  task_status: string;
};

export type FetchTask = {
  id: string;
  user_id: string;
};

export type DeleteTask = {
  id: string;
  user_id: string;
};
