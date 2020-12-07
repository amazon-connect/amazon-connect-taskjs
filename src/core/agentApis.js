const ReferenceType = connect.makeEnum([
  'URL'
]);

const createTask = function(taskContact, callbacks) {
  connect.assertNotNull(taskContact, 'Task contact object');
  connect.assertNotNull(taskContact.name, 'Task name');
  connect.assertNotNull(taskContact.endpoint, 'Task endpoint');

  taskContact.idempotencyToken = AWS.util.uuid.v4();
  delete taskContact.endpoint.endpointId;

  var client = connect.core.getClient();

  client.call(connect.ClientMethods.CREATE_TASK_CONTACT, taskContact, callbacks);
};

export { createTask, ReferenceType };
