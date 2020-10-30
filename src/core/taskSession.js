import { TaskController } from './taskController';
import { TASK_EVENTS } from '../constants';

class TaskSession {
  constructor(controller) {
    this.controller = controller;
  }

  onMessage(callback){
    this.controller.subscribe(TASK_EVENTS.INCOMING_MESSAGE, callback);
  }

  onTransferSucceeded(callback) {
    this.controller.subscribe(TASK_EVENTS.TRANSFER_SUCCEEDED, callback);
  }

  onTransferFailed(callback) {
    this.controller.subscribe(TASK_EVENTS.TRANSFER_FAILED, callback);
  }

  onTransferInitiated(callback) {
    this.controller.subscribe(TASK_EVENTS.TRANSFER_INITIATED, callback);
  }

  onTaskExpiring(callback) {
    this.controller.subscribe(TASK_EVENTS.TASK_EXPIRING, callback);
  }

  onTaskExpired(callback) {
    this.controller.subscribe(TASK_EVENTS.TASK_EXPIRED, callback);
  }

  onConnectionBroken(callback) {
    this.controller.subscribe(TASK_EVENTS.CONNECTION_BROKEN, callback);
  }

  onConnectionEstablished(callback) {
    this.controller.subscribe(TASK_EVENTS.CONNECTION_ESTABLISHED, callback);
  }

  connect(args) {
    return this.controller.connect(args);
  }

  cleanUp() {
    this.controller.unsubscribeAll();
  }
}

const TaskSessionObject = {
  create: (args) => {
    const taskController = new TaskController(args);
    return new TaskSession(taskController);
  },
};

export { TaskSessionObject, TaskSession };
