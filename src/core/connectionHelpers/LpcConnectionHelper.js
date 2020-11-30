const ConnectionHelperStatus = {
  NeverStarted: 'NeverStarted',
  Starting: 'Starting',
  Connected: 'Connected',
  ConnectionLost: 'ConnectionLost',
  Ended: 'Ended',
};

const ConnectionHelperEvents = {
  ConnectionLost: 'ConnectionLost',
  ConnectionGained: 'ConnectionGained',
  Ended: 'Ended',
  IncomingMessage: 'IncomingMessage',
};

class LpcConnectionHelper {
  constructor(contactId, initialContactId, websocketManager) {
    if (!LpcConnectionHelper.baseInstance) {
      LpcConnectionHelper.baseInstance = new LPCConnectionHelperBase(websocketManager);
    }
    this.contactId = contactId;
    this.initialContactId = initialContactId;
    this.status = null;
    this.eventBus = new connect.EventBus();
    this.subscriptions = [
      LpcConnectionHelper.baseInstance.onEnded(this.handleEnded.bind(this)),
      LpcConnectionHelper.baseInstance.onConnectionGain(this.handleConnectionGain.bind(this)),
      LpcConnectionHelper.baseInstance.onConnectionLost(this.handleConnectionLost.bind(this)),
      LpcConnectionHelper.baseInstance.onMessage(this.handleMessage.bind(this)),
    ];
  }

  start() {
    return LpcConnectionHelper.baseInstance.start();
  }

  end() {
    this.eventBus.unsubscribeAll();
    this.subscriptions.forEach(f => f.unsubscribe());
    this.status = ConnectionHelperStatus.Ended;
  }

  getStatus() {
    return this.status || LpcConnectionHelper.baseInstance.getStatus();
  }

  onEnded(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.Ended, handler);
  }

  handleEnded() {
    this.eventBus.trigger(ConnectionHelperEvents.Ended, {});
  }

  onConnectionGain(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.ConnectionGained, handler);
  }

  handleConnectionGain() {
    this.eventBus.trigger(ConnectionHelperEvents.ConnectionGained, {});
  }

  onConnectionLost(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.ConnectionLost, handler);
  }

  handleConnectionLost() {
    this.eventBus.trigger(ConnectionHelperEvents.ConnectionLost, {});
  }

  onMessage(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.IncomingMessage, handler);
  }

  handleMessage(message) {
    if (message.InitialContactId === this.initialContactId || message.ContactId === this.contactId) {
      this.eventBus.trigger(ConnectionHelperEvents.IncomingMessage, message);
    }
  }
}

LpcConnectionHelper.baseInstance = null;

class LPCConnectionHelperBase {
  constructor(websocketManager) {
    this.status = ConnectionHelperStatus.NeverStarted;
    this.eventBus = new connect.EventBus();
    this.initWebsocketManager(websocketManager);
  }

  initWebsocketManager(websocketManager) {
    this.websocketManager = websocketManager;
    this.websocketManager.subscribeTopics(['aws/task']);
    this.subscriptions = [
      this.websocketManager.onMessage('aws/task', this.handleMessage.bind(this)),
      this.websocketManager.onConnectionGain(this.handleConnectionGain.bind(this)),
      this.websocketManager.onConnectionLost(this.handleConnectionLost.bind(this)),
      this.websocketManager.onInitFailure(this.handleEnded.bind(this)),
    ];
  }

  start() {
    if (this.status === ConnectionHelperStatus.NeverStarted) {
      this.status = ConnectionHelperStatus.Starting;
    }
    return Promise.resolve();

  }

  onEnded(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.Ended, handler);
  }

  handleEnded() {
    this.status = ConnectionHelperStatus.Ended;
    this.eventBus.trigger(ConnectionHelperEvents.Ended, {});
  }

  onConnectionGain(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.ConnectionGained, handler);
  }

  handleConnectionGain() {
    this.status = ConnectionHelperStatus.Connected;
    this.eventBus.trigger(ConnectionHelperEvents.ConnectionGained, {});
  }

  onConnectionLost(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.ConnectionLost, handler);
  }

  handleConnectionLost() {
    this.status = ConnectionHelperStatus.ConnectionLost;
    this.eventBus.trigger(ConnectionHelperEvents.ConnectionLost, {});
  }

  onMessage(handler) {
    return this.eventBus.subscribe(ConnectionHelperEvents.IncomingMessage, handler);
  }

  handleMessage(message) {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.content);
      this.eventBus.trigger(ConnectionHelperEvents.IncomingMessage, parsedMessage);
    } catch (e) {
      connect.getLog().error(`Wrong message format: %s`, message);
    }
  }

  getStatus() {
    return this.status;
  }
}

export default LpcConnectionHelper;
