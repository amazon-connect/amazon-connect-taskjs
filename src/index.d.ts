// TypeScript definitions for Amazon Connect TaskJS v2.0
// Project: https://github.com/amazon-connect/amazon-connect-taskjs
// Definitions by: Generated from source code analysis

declare namespace AmazonConnectTaskJS {
  // Reference Types Enumeration
  enum ReferenceType {
    URL = 'URL',
    EMAIL = 'EMAIL',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    DATE = 'DATE'
  }

  // Event Content Types
  interface ContentTypes {
    transferSucceeded: 'application/vnd.amazonaws.connect.event.transfer.succeeded';
    transferFailed: 'application/vnd.amazonaws.connect.event.transfer.failed';
    transferInitiated: 'application/vnd.amazonaws.connect.event.transfer.initiated';
    taskExpiring: 'application/vnd.amazonaws.connect.event.expire.warning';
    taskExpired: 'application/vnd.amazonaws.connect.event.expire.complete';
  }

  // Event Message Structure
  interface TaskEventMessage {
    /** UTC timestamp of when the event occurred */
    AbsoluteTime: string;
    /** Content type indicating the type of event */
    ContentType: 
      | 'application/vnd.amazonaws.connect.event.transfer.initiated'
      | 'application/vnd.amazonaws.connect.event.transfer.succeeded'
      | 'application/vnd.amazonaws.connect.event.transfer.failed'
      | 'application/vnd.amazonaws.connect.event.expire.warning'
      | 'application/vnd.amazonaws.connect.event.expire.complete';
    /** The contact ID */
    Id: string;
    /** The initial contact ID */
    InitialContactId: string;
  }

  // Callback function type for task events
  type TaskEventCallback = (message: TaskEventMessage) => void;

  // Generic callback structure for API operations
  interface ApiCallbacks<T = any> {
    success?: (data: T) => void;
    failure?: (error: any) => void;
  }

  // Reference object for tasks
  interface TaskReference {
    /** Reference type */
    type: ReferenceType;
    /** Reference value - string for URL/EMAIL/STRING, number for NUMBER/DATE */
    value: string | number;
  }

  // Endpoint object for task creation
  interface TaskEndpoint {
    /** Endpoint ARN */
    endpointARN: string;
    /** Endpoint ID (will be deleted in processing) */
    endpointId?: string;
  }

  // Task contact object for creating tasks
  interface CreateTaskContact {
    /** Task name (required, max length: 512) */
    name: string;
    /** Task description (optional, max length: 4096) */
    description?: string;
    /** Endpoint for non-templated tasks (required if not using template) */
    endpoint?: TaskEndpoint;
    /** Task template ID for templated tasks */
    taskTemplateId?: string;
    /** Previous contact ID for linked tasks */
    previousContactId?: string;
    /** References object (key-value pairs where key is reference name, value is TaskReference) */
    references?: Record<string, TaskReference>;
    /** Scheduled time as UTC timestamp in seconds */
    scheduledTime?: number;
    /** Quick Connect ID (set automatically from endpoint) */
    quickConnectId?: string;
    /** Idempotency token (set automatically) */
    idempotencyToken?: string;
  }

  // Task template parameters for getTaskTemplate
  interface TaskTemplateParams {
    /** Task template ID (required) */
    id: string;
    /** Task template version (optional) */
    version?: string;
  }

  // Query parameters for listTaskTemplates
  interface ListTaskTemplatesParams {
    /** Template status filter ('active' or 'inactive') */
    status?: 'active' | 'inactive';
    /** Maximum number of results (max: 100) */
    maxResults?: number;
  }

  // Update contact object for templated tasks
  interface UpdateTaskContact {
    /** Task contact ID (required) */
    contactId: string;
    /** Updated task name */
    name?: string;
    /** Updated task description */
    description?: string;
    /** Updated references */
    references?: Record<string, TaskReference>;
  }

  // Response data for createTask success callback
  interface CreateTaskResponse {
    /** Created contact ID */
    contactId: string;
  }

  // Task template data structure
  interface TaskTemplate {
    /** Template ID */
    id: string;
    /** Template version */
    version?: string;
    /** Template name */
    name: string;
    /** Template description */
    description?: string;
    /** Template fields and constraints */
    fields?: any;
    /** Default values */
    defaults?: any;
  }

  // Task templates list response
  interface TaskTemplatesList {
    /** Array of task template summaries */
    taskTemplates: TaskTemplate[];
    /** Next token for pagination */
    nextToken?: string;
  }

  // TaskSession connection arguments
  interface TaskSessionConnectArgs {
    /** Connection configuration */
    [key: string]: any;
  }

  // TaskSession creation arguments  
  interface TaskSessionCreateArgs {
    /** Session configuration */
    [key: string]: any;
  }

  // Main TaskSession class
  interface TaskSession {
    /**
     * Subscribe to all task events
     * @param callback Function to call when any event occurs
     */
    onMessage(callback: TaskEventCallback): void;

    /**
     * Subscribe to task transfer success events
     * @param callback Function to call when transfer succeeds
     */
    onTransferSucceeded(callback: TaskEventCallback): void;

    /**
     * Subscribe to task transfer failure events
     * @param callback Function to call when transfer fails
     */
    onTransferFailed(callback: TaskEventCallback): void;

    /**
     * Subscribe to task transfer initiation events
     * @param callback Function to call when transfer is initiated
     */
    onTransferInitiated(callback: TaskEventCallback): void;

    /**
     * Subscribe to task expiring events (2 hours before expiration)
     * @param callback Function to call when task is expiring
     */
    onTaskExpiring(callback: TaskEventCallback): void;

    /**
     * Subscribe to task expired events
     * @param callback Function to call when task expires
     */
    onTaskExpired(callback: TaskEventCallback): void;

    /**
     * Subscribe to connection broken events
     * @param callback Function to call when connection is broken
     */
    onConnectionBroken(callback: TaskEventCallback): void;

    /**
     * Subscribe to connection established events
     * @param callback Function to call when connection is established
     */
    onConnectionEstablished(callback: TaskEventCallback): void;

    /**
     * Connect the task session
     * @param args Connection arguments
     * @returns Connection result
     */
    connect(args: TaskSessionConnectArgs): any;

    /**
     * Clean up the task session and unsubscribe from all events
     */
    cleanUp(): void;
  }

  // TaskSessionObject factory
  interface TaskSessionObject {
    /**
     * Create a new TaskSession instance
     * @param args Creation arguments
     * @returns New TaskSession instance
     */
    create(args: TaskSessionCreateArgs): TaskSession;
  }

  // Agent interface extensions
  interface Agent {
    /**
     * Create a new task
     * @param taskContact Task contact object with task details
     * @param callbacks Success/failure callbacks
     */
    createTask(taskContact: CreateTaskContact, callbacks: ApiCallbacks<CreateTaskResponse>): void;

    /**
     * Get task template details
     * @param templateParams Template parameters including ID and optional version
     * @param callbacks Success/failure callbacks
     */
    getTaskTemplate(templateParams: TaskTemplateParams, callbacks: ApiCallbacks<TaskTemplate>): void;

    /**
     * List available task templates
     * @param queryParams Query parameters for filtering and pagination
     * @param callbacks Success/failure callbacks
     */
    listTaskTemplates(queryParams: ListTaskTemplatesParams, callbacks: ApiCallbacks<TaskTemplatesList>): void;

    /**
     * Update an existing templated task contact
     * @param taskObject Task update object with contact ID and updated fields
     * @param callbacks Success/failure callbacks
     */
    updateContact(taskObject: UpdateTaskContact, callbacks: ApiCallbacks<void>): void;
  }

  // Connection interface (from Amazon Connect Streams)
  interface Connection {
    /**
     * Get the media controller for this connection (task session)
     * @returns Promise that resolves with the TaskSession instance
     */
    getMediaController(): Promise<TaskSession>;
  }
}

// Global connect namespace extensions
declare namespace connect {
  // Add TaskSession to global connect object
  const TaskSession: AmazonConnectTaskJS.TaskSessionObject;

  // Add ReferenceType enum to global connect object
  const ReferenceType: typeof AmazonConnectTaskJS.ReferenceType;

  // Extend existing Agent prototype with task methods
  interface Agent extends AmazonConnectTaskJS.Agent {}
}

// ES Module exports
declare module 'amazon-connect-taskjs' {
  export const TaskSession: AmazonConnectTaskJS.TaskSessionObject;
  export const ReferenceType: typeof AmazonConnectTaskJS.ReferenceType;
}

// Export the main namespace
export = AmazonConnectTaskJS;
export as namespace AmazonConnectTaskJS;
