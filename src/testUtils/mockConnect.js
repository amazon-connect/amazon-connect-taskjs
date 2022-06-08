global.connect = {
  core: {
    getClient: () => ({
      client: () => {}
    }),
    getAgentDataProvider: () => ({getInstanceId: () => 'baf4b555-fa63-445f-8359-5866f35ab09b'})
  },
  ClientMethods: {
    CREATE_TASK_CONTACT: 'CREATE_TASK_CONTACT'
  },
  TaskTemplatesClientMethods: {
    CREATE_TEMPLATED_TASK: 'CREATE_TEMPLATED_TASK',
    LIST_TASK_TEMPLATES: 'LIST_TASK_TEMPLATES',
    GET_TASK_TEMPLATE: 'GET_TASK_TEMPLATE',
    UPDATE_CONTACT: 'UPDATE_CONTACT'
  },
  makeEnum: () => {},
  assertNotNull: (value, message) => {
    if (value === null || value === undefined) {
      throw new Error(`A value must be provided: ${message}`);
    }
  }
};