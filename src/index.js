import { TaskSessionObject } from "./core/taskSession";

global.connect = global.connect || {};
connect.TaskSession = TaskSessionObject;
export const TaskSession = TaskSessionObject;