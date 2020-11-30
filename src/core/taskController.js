import LpcConnectionHelper from './connectionHelpers/LpcConnectionHelper';
import { CONTENT_TYPE_TO_EVENT_MAP, TASK_EVENTS } from '../constants';

class TaskController {
  constructor(args) {
    this.pubsub = new connect.EventBus();
    this.initialContactId = args.initialContactId;
    this.contactId = args.contactId;
    this.websocketManager = args.websocketManager;
  }

  subscribe(eventName, callback) {
    this.pubsub.subscribe(eventName, callback);
    connect.getLog().info(connect.LogComponent.TASK, `Subscribed successfully to eventName: %s`, eventName);
  }

  connect() {
    return this._initConnectionHelper().then(this._onConnectSuccess.bind(this), this._onConnectFailure.bind(this));
  }

  getTaskDetails() {
    return {
      initialContactId: this.initialContactId,
      contactId: this.contactId,
    };
  }

  unsubscribeAll() {
    this.pubsub.unsubscribeAll();
    this.connectionHelper.end();
  }

  _triggerEvent(eventName, eventData) {
    connect.getLog().debug(connect.LogComponent.TASK, 'Triggering event for subscribers: %s', eventName).withObject({
      data: eventData,
      taskDetails: this.getTaskDetails(),
    });
    this.pubsub.trigger(eventName, eventData);
  }

  _onConnectSuccess(response) {
    connect.getLog().info(connect.LogComponent.TASK, 'Connect successful!');
    const responseObject = {
      _debug: response,
      connectSuccess: true,
      connectCalled: true,
    };

    this._triggerEvent(TASK_EVENTS.CONNECTION_ESTABLISHED, responseObject);

    return responseObject;
  }

  _onConnectFailure(error) {
    const errorObject = {
      _debug: error,
      connectSuccess: false,
      connectCalled: true,
      metadata: this.sessionMetadata,
    };
    connect.getLog().error(connect.LogComponent.TASK, 'Connect Failed').withException(errorObject);
    return Promise.reject(errorObject);
  }

  _initConnectionHelper() {
    this.connectionHelper = new LpcConnectionHelper(this.contactId, this.initialContactId, this.websocketManager);
    this.connectionHelper.onEnded(this._handleEndedConnection.bind(this));
    this.connectionHelper.onConnectionLost(this._handleLostConnection.bind(this));
    this.connectionHelper.onConnectionGain(this._handleGainedConnection.bind(this));
    this.connectionHelper.onMessage(this._handleIncomingMessage.bind(this));
    return this.connectionHelper.start();
  }

  _handleEndedConnection(eventData) {
    this._triggerEvent(TASK_EVENTS.CONNECTION_BROKEN, eventData);
  }

  _handleGainedConnection(eventData) {
    this._triggerEvent(TASK_EVENTS.CONNECTION_ESTABLISHED, eventData);
  }

  _handleLostConnection(eventData) {
    this._triggerEvent(TASK_EVENTS.CONNECTION_LOST, eventData);
  }

  _handleIncomingMessage(incomingData) {
    const eventType = incomingData.ContentType;
    if (CONTENT_TYPE_TO_EVENT_MAP[eventType]) {
      this._triggerEvent(CONTENT_TYPE_TO_EVENT_MAP[eventType], incomingData);
    }
    this._triggerEvent(TASK_EVENTS.INCOMING_MESSAGE, incomingData);
  }
}

export { TaskController };
