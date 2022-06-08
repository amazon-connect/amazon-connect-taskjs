
import '../testUtils/mockConnect.js';
import { createTask, getTaskTemplate, listTaskTemplates,  updateContact } from './agentApis';

describe('AgentApis', () => {
  const idempotencyToken = '4383f0b7-ddcb-4f8c-a63b-cbd53c852d39';
  const instanceId = 'baf4b555-fa63-445f-8359-5866f35ab09b';
  const taskTemplateId = '61c100a4-1cd4-49fe-9237-6b771e2f0df1';
  const contactId = '2a75a6b8-323d-4f8d-9f73-b15509d98b88';
  const quickConnectId = 'a6a2c310-b91a-4926-8d36-dbc7b758a11d';
  const client = {call: () => {}};
  connect.core.getClient = () => client;
  global.AWS = { util: { uuid: { v4: () => idempotencyToken } } };
  
  describe('CreateTask API', () => {
    let params;
    const taskName = 'Task name';
    const taskDescription = 'Task description';
    

    beforeEach(() => {
      params = {
        name: taskName,
        description: taskDescription,
        endpoint: {
          "endpointARN":`arn:aws:connect:us-west-2:XXXXXX:instance/XXXXXXX/transfer-destination/${quickConnectId}`,
          "type":"queue",
          "name":"John Smith"
        }
      };
    });
    it('When CreateTask parameters contain taskTemplateId then CreateTemplatedTask should be called with normalized params', () => {
      params.taskTemplateId = taskTemplateId;
      client.call = jest.fn();
      createTask(params);
      expect(client.call).toHaveBeenCalledWith(
        connect.TaskTemplatesClientMethods.CREATE_TEMPLATED_TASK, 
        {
          Name: taskName,
          Description: taskDescription,
          TaskTemplateId: taskTemplateId,
          QuickConnectId: quickConnectId
        },
        undefined);
    });
    it('When CreateTask parameters doesn not contain taskTemplateId then CreateTaskContact should be called', () => {
      client.call = jest.fn();
      createTask(params);
      params.idempotencyToken = idempotencyToken;
      expect(client.call).toHaveBeenCalledWith(
        connect.ClientMethods.CREATE_TASK_CONTACT, 
        params,
        undefined);
    });
  });

  describe('UpdateTemplatedTask API', () => {
    let params;
    const name = 'updated task name';
    const references = {
      'Phone number': {
        type: 'STRING',
        value: '+1 234 567 8900',
      },
      'Claim amount': {
        type: 'NUMBER',
        value: '1000',
      }
    };
    const normalizedReferences = {
      'Phone number': {
        Type: 'STRING',
        Value: '+1 234 567 8900',
      },
      'Claim amount': {
        Type: 'NUMBER',
        Value: '1000',
      }
    };

    beforeEach(() => {
      params = {
        contactId,
        name,
        references
      };
    });
    it('Should call an approipriate Streams client api with normalized paramateres', () => {
      client.call = jest.fn();
      updateContact(params);
      expect(client.call).toHaveBeenCalledWith(
        connect.TaskTemplatesClientMethods.UPDATE_CONTACT, 
        {
          ContactId: contactId,
          Name: name,
          References: normalizedReferences
        },
        undefined);
    });
    it('Should throw an error if a required parameter missed', () => {
      client.call = jest.fn();
      delete params.contactId;
      expect(() => {
        updateContact(params);
      }).toThrow();
    });
  });

  describe('ListTaskTemplates API', () => {
    const queryParams = {
      status: 'active', 
      maxResults: 50 
    };
    it('Should call an approipriate Streams client api', () => {
      client.call = jest.fn();
      listTaskTemplates(queryParams);
      expect(client.call).toHaveBeenCalledWith(
        connect.TaskTemplatesClientMethods.LIST_TASK_TEMPLATES, 
        {
          instanceId,
          queryParams
        },
        undefined);
    });
    it('Should throw an error if a required parameter missed', () => {
      client.call = jest.fn();
      expect(() => {
        listTaskTemplates();
      }).toThrow();
    });
  });

  describe('GetTaskTemplate API', () => {
    let templateParams;

    beforeEach(() => {
      templateParams = {
        id: taskTemplateId,
        version: 5
      };
    });
    it('Should call an approipriate Streams client api', () => {
      client.call = jest.fn();
      getTaskTemplate(templateParams);
      expect(client.call).toHaveBeenCalledWith(
        connect.TaskTemplatesClientMethods.GET_TASK_TEMPLATE, 
        {
          instanceId,
          templateParams
        },
        undefined);
    });
    it('Should throw an error if a required parameter missed', () => {
      client.call = jest.fn();
      delete templateParams.id;
      expect(() => {
        getTaskTemplate(templateParams);
      }).toThrow();
    });
  });
});