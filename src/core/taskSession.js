class TaskSession {}

const TaskSessionObject = {
  create: () => {
    return new TaskSession();
  },
};

export { TaskSessionObject, TaskSession };
