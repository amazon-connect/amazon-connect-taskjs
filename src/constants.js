export const TASK_EVENTS = {
  INCOMING_MESSAGE: 'INCOMING_MESSAGE',
  TRANSFER_FAILED: 'TRANSFER_FAILED',
  TRANSFER_SUCCEEDED: 'TRANSFER_SUCCEEDED',
  TRANSFER_INITIATED: 'TRANSFER_INITIATED',
  CONNECTION_ESTABLISHED: "CONNECTION_ESTABLISHED",
  CONNECTION_LOST: "CONNECTION_LOST",
  CONNECTION_BROKEN: "CONNECTION_BROKEN",
  CONNECTION_ACK: "CONNECTION_ACK"
};

export const CONTENT_TYPE = {
  transferSucceeded: 'application/vnd.amazonaws.connect.event.transfer.succeeded',
  transferFailed: 'application/vnd.amazonaws.connect.event.transfer.failed',
  transferInitiated: 'application/vnd.amazonaws.connect.event.transfer.initiated',
};

export const CONTENT_TYPE_TO_EVENT_MAP = {
  'application/vnd.amazonaws.connect.event.transfer.initiated': TASK_EVENTS.TRANSFER_INITIATED,
  'application/vnd.amazonaws.connect.event.transfer.succeeded': TASK_EVENTS.TRANSFER_SUCCEEDED,
  'application/vnd.amazonaws.connect.event.transfer.failed': TASK_EVENTS.TRANSFER_FAILED,
};

export const EVENT = 'EVENT';
export const MESSAGE = 'MESSAGE';
