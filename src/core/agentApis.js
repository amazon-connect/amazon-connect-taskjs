const ReferenceType = connect.makeEnum([
  'URL',
  'EMAIL',
  'NUMBER',
  'STRING',
  'DATE'
]);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function normalizeTaskTemplateAPIParams(params) {
  Object.keys(params).forEach(key => {
    const uppercaseKey = capitalizeFirstLetter(key);
    if (uppercaseKey !== key) {
      params[uppercaseKey] = params[key];
      delete params[key];
    }
    if (uppercaseKey === 'References') {
      Object.values(params[uppercaseKey]).forEach(obj => normalizeTaskTemplateAPIParams(obj));
    }
  });
}

const createTask = function(taskContact, callbacks) {
  connect.assertNotNull(taskContact, 'Task contact object');
  connect.assertNotNull(taskContact.name, 'Task name');
  var client = connect.core.getClient();
  if (taskContact.taskTemplateId) {
    if (taskContact.endpoint) {
      taskContact.quickConnectId = taskContact.endpoint.endpointARN.split('/').pop();
      delete taskContact.endpoint;
    }
    normalizeTaskTemplateAPIParams(taskContact);
    client.call(connect.TaskTemplatesClientMethods.CREATE_TEMPLATED_TASK, taskContact, callbacks);
  } else {
    connect.assertNotNull(taskContact.endpoint, 'Task endpoint');
    taskContact.idempotencyToken = AWS.util.uuid.v4();
    delete taskContact.endpoint.endpointId;
    client.call(connect.ClientMethods.CREATE_TASK_CONTACT, taskContact, callbacks);
  }
};

const listTaskTemplates = function(queryParams, callbacks) {
  connect.assertNotNull(queryParams, 'Query params for listTaskTemplates');
  var client = connect.core.getClient();
  var instanceId = connect.core.getAgentDataProvider().getInstanceId();
  client.call(connect.TaskTemplatesClientMethods.LIST_TASK_TEMPLATES, { instanceId, queryParams }, callbacks);
};

const getTaskTemplate = function(templateParams, callbacks) {
  connect.assertNotNull(templateParams, 'Task template params');
  connect.assertNotNull(templateParams.id, 'Task template id');
  var client = connect.core.getClient();
  var instanceId = connect.core.getAgentDataProvider().getInstanceId();
  client.call(connect.TaskTemplatesClientMethods.GET_TASK_TEMPLATE, { instanceId, templateParams }, callbacks);
};

const updateContact = function(taskObject, callbacks) {
  connect.assertNotNull(taskObject, 'Update for templated task');
  connect.assertNotNull(taskObject.contactId, 'Task contact id');
  var client = connect.core.getClient();
  normalizeTaskTemplateAPIParams(taskObject);
  client.call(connect.TaskTemplatesClientMethods.UPDATE_CONTACT, taskObject, callbacks);
};

export { createTask, getTaskTemplate, listTaskTemplates, updateContact, ReferenceType };
