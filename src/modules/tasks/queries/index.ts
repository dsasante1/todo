const createTask = `
    INSERT INTO tasks (
        user_id,
        task,
        priority
    ) VALUES ($/user_id/, $/task/, $/priority/)
    RETURNING *;
`;

const updateTask = `
    UPDATE tasks 
    SET task = $3, priority = $4
    WHERE id = $1 AND user_id = $2 
    RETURNING *;
`;

const updatePriority = `
    UPDATE tasks 
    SET priority = $3
    WHERE id = $1 AND user_id = $2 
    RETURNING *;
`;

const updateTaskStatus = `
    UPDATE tasks 
    SET completed = $3
    WHERE id = $1 AND user_id = $2 
    RETURNING *;
`;

const findTaskById = `
    SELECT *
    FROM tasks 
    WHERE id = $1 AND user_id = $2;
`;

const fetchTasks = `
    SELECT *
    FROM tasks
    WHERE user_id = $1;
`;

const deleteTask = `
    DELETE FROM tasks
    WHERE id = $1 AND user_id = $2
    RETURNING *;
`;

const searchTasks = `
    SELECT *
    FROM tasks
    WHERE user_id = $1 `;

const TaskQueries = {
  createTask,
  updateTask,
  findTaskById,
  fetchTasks,
  deleteTask,
  searchTasks,
  updatePriority,
  updateTaskStatus,
};

export default TaskQueries;
