import { TaskSessionObject } from './core/taskSession';
import { createTask, getTaskTemplate, listTaskTemplates,  updateContact, ReferenceType } from './core/agentApis';

global.connect = global.connect || {};
connect.TaskSession = TaskSessionObject;

if (!connect.Agent.prototype.createTask) connect.Agent.prototype.createTask = createTask;
if (!connect.Agent.prototype.getTaskTemplate) connect.Agent.prototype.getTaskTemplate = getTaskTemplate;
if (!connect.Agent.prototype.listTaskTemplates) connect.Agent.prototype.listTaskTemplates = listTaskTemplates;
if (!connect.Agent.prototype.updateContact) connect.Agent.prototype.updateContact = updateContact;

connect.ReferenceType = ReferenceType;

export const TaskSession = TaskSessionObject;
