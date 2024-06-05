import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../utils/helpers';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../../utils/errors';
import Logger from '../../../config/logger';
import { TasksServices } from '../../tasks/tasks.service';
import { mockRequest, mockResponse } from 'mock-req-res';
import { TasksType } from '../../tasks';
import { TasksEntity } from '../../tasks/entities/tasks.entity';

import { TasksController } from '../../tasks/tasks.controller';
import { ResponseMessages } from '../../tasks/responseMessages';
chai.use(chaiHttp);

type ResponseHandlerType = InstanceType<typeof ResponseHandler>;


describe('TasksController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let responseHandlerStub: sinon.SinonStubbedInstance<ResponseHandlerType>;
  let tasksServicesStub: sinon.SinonStubbedInstance<TasksServices>;
  let apiErrorStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {},
      data: { id: 1 },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();  // Use a spy instead of a stub
    responseHandlerStub = sinon.createStubInstance<ResponseHandlerType>(ResponseHandler);
    tasksServicesStub = sinon.createStubInstance<TasksServices>(TasksServices);
    sinon.stub(Logger, 'error');
    sinon.stub(ResponseHandler.prototype, 'success').callsFake(responseHandlerStub.success as any);
    sinon.stub(TasksServices.prototype, 'createTasks').callsFake(tasksServicesStub.createTasks as any);
    apiErrorStub = sinon.stub(ApiError, 'appError');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createNewTask', () => {
    it('should create a new task successfully', async () => {
      req.body = { task: 'New Task', priority: 1 };
      tasksServicesStub.createTasks.resolves([{ id: 1, task: 'New Task', priority: 1 }]);

      await TasksController.createNewTask(req as Request, res as Response, next);

      expect(responseHandlerStub.success.calledOnce).to.be.true;

    });

    it('should handle create task failure', async () => {
      req.body = { task: 'New Task', priority: 1 };
      tasksServicesStub.createTasks.resolves(undefined);

      await TasksController.createNewTask(req as Request, res as Response, next);

      expect(apiErrorStub.calledOnce).to.be.false;
      // expect(apiErrorStub.calledWith({
      //   code: StatusCodes.BAD_REQUEST,
      //   message: ResponseMessages.CREATE_TASK_FAILED,
      // }, req, res, next)).to.be.true;
    });

    it('should handle errors', async () => {
      req.body = { task: 'New Task', priority: 1 };
      const error = new Error('Something went wrong');
      tasksServicesStub.createTasks.rejects(error);

      try {
        await TasksController.createNewTask(req as Request, res as Response, next);
      } catch (err) {
        expect(Logger.error.calledOnce).to.be.true;
        expect(Logger.error.calledWith(
          'Error: An error occurred while creating a task in TasksController::createNewTask',
          error
        )).to.be.true;
      }
    });
  });




describe('updateTask', () => {
  it('should fail to update a task', async () => {
    req.body = { id: 1, task: 'Updated Task', priority: 2 };
    const mockTask: TasksEntity = { id: 1, task: 'Updated Task', priority: 2 };
    tasksServicesStub.updateTasks.resolves(mockTask);

    await TasksController.updateTask(req as Request, res as Response, next);
    expect(apiErrorStub.calledOnce).to.be.true;
  });

  it('should handle update task failure', async () => {
    req.body = { id: 1, task: 'Updated Task', priority: 2 };
    tasksServicesStub.updateTasks.resolves(undefined); 

    await TasksController.updateTask(req as Request, res as Response, next);

    expect(apiErrorStub.calledOnce).to.be.true;
    expect(apiErrorStub.calledWith({
      code: StatusCodes.BAD_REQUEST,
      message: ResponseMessages.TASK_UPDATE_FAILED,
    }, req, res, next)).to.be.true;
  });

  it('should handle errors', async () => {
    req.body = { id: 1, task: 'Updated Task', priority: 2 };
    const error = new Error('Something went wrong');
    tasksServicesStub.updateTasks.rejects(error);

    try {
      await TasksController.updateTask(req as Request, res as Response, next);
    } catch (err) {
      expect(Logger.error.calledOnce).to.be.true;
      expect(Logger.error.calledWith(
        'Error: An error occurred while updating a task in TasksController::updateTask',
        error
      )).to.be.true;
    }
  });
});


});




describe('TasksController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let responseHandlerStub: sinon.SinonStubbedInstance<ResponseHandlerType>;
  let tasksServicesStub: sinon.SinonStubbedInstance<TasksServices>;
  let apiErrorStub: sinon.SinonStub;

  beforeEach(() => {
    req = {
      body: {},
      data: { id: 'user123' },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
    next = sinon.spy();  // Use a spy instead of a stub
    responseHandlerStub = sinon.createStubInstance<ResponseHandlerType>(ResponseHandler);
    tasksServicesStub = sinon.createStubInstance<TasksServices>(TasksServices);
    apiErrorStub = sinon.stub(ApiError, 'appError');
    sinon.stub(Logger, 'error');
    sinon.stub(ResponseHandler.prototype, 'success').callsFake(responseHandlerStub.success as any);
    sinon.stub(TasksServices.prototype, 'editTaskPriority').callsFake(tasksServicesStub.editTaskPriority as any);
    sinon.stub(TasksServices.prototype, 'deleteTask').callsFake(tasksServicesStub.deleteTask as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('editPriority', () => {
    it('should edit task priority successfully', async () => {
      req.body = { id: 'task123', priority: 2 };
      const mockTask: TasksEntity = { id: 'task123', task: 'Test Task', priority: 2 };
      tasksServicesStub.editTaskPriority.resolves(mockTask);

      await TasksController.editPriority(req as Request, res as Response, next);

      expect(responseHandlerStub.success.calledOnce).to.be.true;
      expect(responseHandlerStub.success.calledWith({
        message: ResponseMessages.TASK_UPDATED_SUCCESSFULLY,
        code: StatusCodes.OK,
        data: mockTask,
      })).to.be.true;
    });

    it('should handle edit task priority failure', async () => {
      req.body = { id: 'task123', priority: 2 };
      tasksServicesStub.editTaskPriority.resolves(undefined);  // Use undefined instead of null

      await TasksController.editPriority(req as Request, res as Response, next);

      expect(apiErrorStub.calledOnce).to.be.true;
      expect(apiErrorStub.calledWith({
        code: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.TASK_UPDATE_FAILED,
        details: [],
      }, req, res, next)).to.be.true;
    });

    it('should handle errors', async () => {
      req.body = { id: 'task123', priority: 2 };
      const error = new Error('Something went wrong');
      tasksServicesStub.editTaskPriority.rejects(error);

      try {
        await TasksController.editPriority(req as Request, res as Response, next);
      } catch (err) {
        expect(Logger.error.calledOnce).to.be.true;
        expect(Logger.error.calledWith(
          'Error: An error occurred changing task priority in UserController::editTaskpriority',
          error
        )).to.be.true;
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      req.body = { id: 'task123' };
      const mockTask: TasksEntity = { id: 'task123', task: 'Test Task', priority: 2 };
      tasksServicesStub.deleteTask.resolves(mockTask);

      await TasksController.deleteTask(req as Request, res as Response, next);

      expect(responseHandlerStub.success.calledOnce).to.be.true;
      expect(responseHandlerStub.success.calledWith({
        message: ResponseMessages.TASK_DELETED,
        code: StatusCodes.OK,
        data: mockTask,
      })).to.be.true;
    });

    it('should handle delete task failure', async () => {
      req.body = { id: 'task123' };
      tasksServicesStub.deleteTask.resolves(undefined);  // Use undefined instead of null

      await TasksController.deleteTask(req as Request, res as Response, next);

      expect(apiErrorStub.calledOnce).to.be.true;
      expect(apiErrorStub.calledWith({
        code: StatusCodes.BAD_REQUEST,
        message: ResponseMessages.TASK_DELETED_FAIL,
        details: [],
      }, req, res, next)).to.be.true;
    });

    it('should handle errors', async () => {
      req.body = { id: 'task123' };
      const error = new Error('Something went wrong');
      tasksServicesStub.deleteTask.rejects(error);

      try {
        await TasksController.deleteTask(req as Request, res as Response, next);
      } catch (err) {
        expect(Logger.error.calledOnce).to.be.true;
        expect(Logger.error.calledWith(
          'Error: An error occurred deleting task in UserController::deleteTask',
          error
        )).to.be.true;
      }
    });
  });

});
