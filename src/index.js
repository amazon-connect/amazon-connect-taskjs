import { TaskSessionObject } from './core/taskSession';
import { createTask, ReferenceType } from './core/agentApis';

global.connect = global.connect || {};
connect.TaskSession = TaskSessionObject;

if (!connect.Agent.prototype.createTask) connect.Agent.prototype.createTask = createTask;

connect.ReferenceType = ReferenceType;

export const TaskSession = TaskSessionObject;
