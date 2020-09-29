import { TaskSessionObject, TaskSession } from "./taskSession";

describe('TaskSession', () => {
  test('create() should return TaskSession instance', () => {
    const myTaskSession = TaskSessionObject.create();
    expect(myTaskSession).toBeInstanceOf(TaskSession);
  });
});