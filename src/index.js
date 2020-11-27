import { TaskSessionObject } from './core/taskSession';
import { createTask } from './core/agentApis';

global.connect = global.connect || {};
connect.TaskSession = TaskSessionObject;

if (!connect.Agent.prototype.createTask) connect.Agent.prototype.createTask = createTask;

export const TaskSession = TaskSessionObject;
