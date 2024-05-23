// import { expect } from 'chai';
// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import { Request, Response, NextFunction } from 'express';
// import { TasksController } from '../../tasks/tasks.controller';
// import { ResponseHandler } from '../../utils/helpers';
// import { StatusCodes } from 'http-status-codes';
// import { ApiError } from '../../utils/errors';
// import Logger from '../../config/logger';
// import { TasksServices } from '../../tasks/tasks.service';
// import { mockRequest, mockResponse } from 'mock-req-res';

// chai.use(chaiHttp);

// describe('TasksController', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let next: NextFunction;
//   let responseHandlerStub: sinon.SinonStubbedInstance<ResponseHandler>;
//   let createTasksStub: sinon.SinonStub;

//   beforeEach(() => {
//     req = {
//       body: {},
//       data: { id: 'userId' },
//     };
//     res = {
//       json: sinon.stub(),
//       status: sinon.stub().returnsThis(),
//     };
//     next = sinon.stub();
//     responseHandlerStub = sinon.createStubInstance(ResponseHandler);
//     createTasksStub = sinon.stub(TasksServices.prototype, 'createTasks');
//   });

//   afterEach(() => {
//     sinon.restore();
//   });

//   it('should create a new task successfully', async () => {
//     req.body = { task: 'New Task', priority: 1 };
//     const mockTask = { id: 'taskId', task: 'New Task', priority: 1 };
//     createTasksStub.resolves(mockTask);

//     const createNewTask = TasksController.createNewTask.bind({
//       response: responseHandlerStub,
//     });

//     await createNewTask(req as Request, res as Response, next);

//     expect(createTasksStub.calledOnce).to.be.true;
//     expect(createTasksStub.calledWith({
//       id: 'userId',
//       task: 'New Task',
//       priority: 1,
//     })).to.be.true;

//     expect(responseHandlerStub.success.calledOnce).to.be.true;
//     expect(responseHandlerStub.success.calledWith({
//       message: 'Task created successfully.',
//       code: StatusCodes.OK,
//       data: mockTask,
//     })).to.be.true;
//   });

//   it('should handle errors when creating a new task', async () => {
//     req.body = { task: 'New Task', priority: 1 };
//     createTasksStub.rejects(new Error('Something went wrong'));

//     const createNewTask = TasksController.createNewTask.bind({
//       response: responseHandlerStub,
//     });

//     await createNewTask(req as Request, res as Response, next);

//     expect(createTasksStub.calledOnce).to.be.true;
//     expect(next.calledOnce).to.be.true;
//     expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//   });

//   // Add more test cases for other controller methods...

// });


// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');

// const expect = chai.expect;
// chai.use(chaiHttp);

// const { TasksController } = require('./tasks.controller');

// describe('TasksController', () => {
//   describe('createNewTask', () => {
//     it('should create a new task successfully', async () => {
//       const req = mockRequest({ body: { task: 'Test task', priority: 1 } });
//       const res = mockResponse()
//       const next = sinon.spy();

//       sinon.stub(TasksServices.prototype, 'createTasks').resolves({ id: 1 });

//       await TasksController.createNewTask(req, res, next);

//       expect(res.json).calledOnceWith({
//         message: 'Task created',
//         code: 200,
//         data: { id: 1 },
//       });
//       expect(next).not.called;
//     });

//     it('should handle createTasks error', async () => {


//       const req = mockRequest({ body: { task: 'Test task', priority: 1 } });
//       const res = mockResponse()
//       const next = sinon.spy();

//       sinon.stub(TasksServices.prototype, 'createTasks').rejects(new Error('Create task error'));

//       await TasksController.createNewTask(req, res, next);

//       expect(res.json).not.called;
//       expect(next).calledOnceWith(sinon.match.instanceOf(Error));
//     });
//   });


// });

