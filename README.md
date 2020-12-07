## AmazonConnectTaskJS

# About
The Amazon Connect Task javascript library (TaskJS) gives you the power to handle task contacts when used together with [Amazon Connect Streams](https://github.com/aws/amazon-connect-streams).

# Learn More
To learn more about Amazon Connect and its capabilities, please check out
the [Amazon Connect User Guide](https://docs.aws.amazon.com/connect/latest/userguide/).

# Getting Started

### Using TaskJS from Github
```
$ git clone https://github.com/amazon-connect/amazon-connect-taskjs
```

### Including TaskJS

[Amazon Connect Streams](https://github.com/aws/amazon-connect-streams) is required to use TaskJS. Ensure you import TaskJS after Streams.

# Building
1. Install latest LTS version of [NodeJS](https://nodejs.org)
2. Checkout this package into workspace and navigate to root folder
3. `npm install`
4. To build (non-minified):
    1. `npm run devo` for a non-minified build.
    2. Find build artifacts in **dist** directory.
5. To build (minified):
    1. `npm run release` for a minified build.
    2. Find build artifacts in **dist** directory.
6. To run unit tests:
    1. `npm run test`
7. To clean node_modules:
    1. `npm run clean`
8. To make webpack watch all files:
    1. `npm run watch`

Find build artifacts in **dist** directory -  This will generate a file called `amazon-connect-task.js` - this is the full Connect TaskJS API which you will want to include in your page.


# Usage:

TaskJS provides a `taskSession` instance for each task contact. You can access the `taskSession` by calling the `getMediaController` method on a `taskConnection`. `getMediaController` returns a promise that resolves with a `taskSession` instance.

For example:

```js
taskConnection.getMediaController().then((taskSession) => { /* ... */ });
```

## Event Handlers

Each of the following event handlers will pass a message object to the callback function containing the following fields:

* `AbsoluteTime`: UTC timestamp of when the event occurred.
* `ContentType`: One of the following strings depending on the event:
  * `application/vnd.amazonaws.connect.event.transfer.initiated`
  * `application/vnd.amazonaws.connect.event.transfer.succeeded`
  * `application/vnd.amazonaws.connect.event.transfer.failed`
  * ` application/vnd.amazonaws.connect.event.expire.warning`
  * `application/vnd.amazonaws.connect.event.expire.complete`
* `Id`: The contact ID
* `InitialContactId`: The [initial contact id](https://github.com/amazon-connect/amazon-connect-streams/blob/master/Documentation.md#contactgetoriginalcontactid--contactgetinitialcontactid).

### `taskSession.onTransferInitiated`

Subscribe a method to be invoked when the server has initiated the task transfer.

```js
taskSession.onTransferInitiated((message) => console.log("Transfer has initiated"))
```

### `taskSession.onTransferSucceeded`

Subscribe a method to be invoked when the task transfer has succeeded.

```js
taskSession.onTransferSucceeded((message) => console.log("Transfer has succeeded"))
```

### `taskSession.onTransferFailed`

Subscribe a method to be invoked when the task transfer has failed.

```js
taskSession.onTransferFailed((message) => console.log("Transfer has failed"))
```

### `taskSession.onTaskExpiring`

Subscribe a method to be invoked two hours before the task expires.

```js
taskSession.onTaskExpiring((message) => console.log("Task will expire in two hours"))
```

### `taskSession.onTaskExpired`

Subscribe a method to be invoked when the task has expired.

```js
taskSession.onTaskExpired((message) => console.log("Task has expired"))
```

### `taskSession.onMessage`

Subscribe a method to be invoked when any one of the above events has occurred.

```js
taskSession.onMessage((message) => console.log("The following event has occurred:", message.ContentType))
```

## Methods

### `agent.createTask()`

Create a new task.

```js
const newTask = {
    name: "string", //required, max len: 512
    description: "string", //optional, max len: 4096
    endpoint: endpointObject, //required, can be retrieved via `agent.getEndpoints()`. Agent and queue endpoints supported.
    previousContactId: "string", //optional, the previous contact ID for a linked task
    references: { //optional
    	"reference name": { // string, max len: 4096
    		type: "URL" //required, currently only "URL" is supported as a reference type,
    		value: "https://www.amazon.com" //required, string, max len: 4096
    	}	
    }
};

agent.createTask(newTask, {
	success: function(data) { console.log("Created a task with contact id: ", data.contactId) },
	failure: function(err) { /* ... */ }
});

```

## Enumerations

### `connect.ReferenceType`
This enumeration lists the different reference types for a task. Currently there is only one reference type, URL.

* `ReferenceType.URL`: A URL reference.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
