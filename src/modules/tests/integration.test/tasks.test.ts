import chai from 'chai';
import chaiHttp from 'chai-http';
import App from '../../../config/express';


const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1/task';

describe('Tasks Routes', () => {

    
  it('Should add task successfully', (done) => {
    const token = process.env.USER_TOKEN!;
    chai
      .request(App())
      .post(`${baseUrl}/new`)
      .set('Authorization', token)
      .send({
        user_id: process.env.USER_ID,
        task: 'notify_android_token',
        priority: 2,
      })
      .end((err: any, res: { status: any, body:any }) => {
        process.env.FIRST_TASK_ID = res.body.data.id;
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('Should add task with different priority successfully', (done) => {
    const token = process.env.USER_TOKEN!;
    chai
      .request(App())
      .post(`${baseUrl}/new`)
      .set('Authorization', token)
      .send({
        user_id: process.env.USER_ID,
        task: 'notify_web_token',
        priority: 1,
      })
      .end((err: any, res: { status: any, body: any }) => {
        process.env.SECOND_TASK_ID = res.body.data.id;
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('Should fail to add task with missing details', (done) => {
    const token = process.env.USER_TOKEN!;
    chai
      .request(App())
      .post(`${baseUrl}/new`)
      .set('Authorization', token)
      .send({
      })
      .end((err: any, res: { status: any }) => {
        expect(res.status).to.equal(400);
        done(err);
      });
  });

//   it('Should add another task successfully', (done) => {
//     const token = process.env.USER_TOKEN!;
//     chai
//       .request(App())
//       .post(`${baseUrl}/new`)
//       .set('Authorization', token)
//       .send({
//         user_id: process.env.USER_ID,
//         task: 'notify_web_token',
//         priority: 1,
//       })
//       .end((err: any, res: { status: any, body: any }) => {
//         process.env.SECOND_TASK_ID = res.body.data.id;
//         expect(res.status).to.equal(200);
//         done(err);
//       });
//   });

//   it('Should add third task successfully', (done) => {
//     const token = process.env.USER_TOKEN!;
//     chai
//       .request(App())
//       .post(`${baseUrl}/new`)
//       .set('Authorization', token)
//       .send({
//         user_id: process.env.SECOND_USER_ID,
//         task: 'notify_iphone_token',
//       })
//       .end((err: any, res: { status: any, body: any }) => {
//         process.env.THIRD_TASK_ID = res.body.data.id;
//         expect(res.status).to.equal(200);
//         done(err);
//       });
//   });

  it('Should update task successfully', (done) => {
    
    const token = process.env.USER_TOKEN!;
    chai
      .request(App())
      .put(`${baseUrl}/edit`)
      .set('Authorization', token)
      .send({
        id: process.env.FIRST_TASK_ID,
        task: "some new task",
        priority: 5,
      })
      .end((err: any, res: { status: any }) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  //   it('Should add another task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.USER_ID,
  //         task: 'notify_web_token',
  //         priority: 1,
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.SECOND_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

  //   it('Should add third task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.SECOND_USER_ID,
  //         task: 'notify_iphone_token',
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.THIRD_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

    it('Should delete task successfully', (done) => {
      const token = process.env.USER_TOKEN!;
      chai
        .request(App())
        .delete(`${baseUrl}/delete`)
        .set('Authorization', token)
        .send({
          id: process.env.FIRST_TASK_ID,
        })
        .end((err: any, res: { status: any }) => {
          expect(res.status).to.equal(200);
          done(err);
        });
    });

  it('Should fetch all tasks successfully', (done) => {
    const token = process.env.USER_TOKEN!;
    chai
      .request(App())
      .get(`${baseUrl}/`)
      .set('Authorization', token)
      .send({
      })
      .end((err: any, res: { status: any }) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });

  it('Should fail to fetch all tasks without authorization', (done) => {
    chai
      .request(App())
      .get(`${baseUrl}/`)
      .send({
      })
      .end((err: any, res: { status: any }) => {
        expect(res.status).to.equal(400);
        done(err);
      });
  });

  //   it('Should add another task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.USER_ID,
  //         task: 'notify_web_token',
  //         priority: 1,
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.SECOND_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

  //   it('Should add third task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.SECOND_USER_ID,
  //         task: 'notify_iphone_token',
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.THIRD_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

    it('Should fail to change task priority', (done) => {
      chai
        .request(App())
        .patch(`${baseUrl}/priority`)
        .send({
          id: process.env.SECOND_TASK_ID,
        })
        .end((err: any, res: { status: any }) => {
          expect(res.status).to.equal(400);
          done(err);
        });
    });

  //   it('Should add another task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.USER_ID,
  //         task: 'notify_web_token',
  //         priority: 1,
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.SECOND_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

  //   it('Should add third task successfully', (done) => {
  //     const token = process.env.USER_TOKEN!;
  //     chai
  //       .request(App())
  //       .post(`${baseUrl}/new`)
  //       .set('Authorization', token)
  //       .send({
  //         user_id: process.env.SECOND_USER_ID,
  //         task: 'notify_iphone_token',
  //       })
  //       .end((err: any, res: { status: any, body: any }) => {
  //         process.env.THIRD_TASK_ID = res.body.data.id;
  //         expect(res.status).to.equal(200);
  //         done(err);
  //       });
  //   });

    it('Should fail to delete task', (done) => {
      const token = process.env.USER_TOKEN!;
      chai
        .request(App())
        .delete(`${baseUrl}/delete`)
        .set('Authorization', token)
        .send({
        })
        .end((err: any, res: { status: any }) => {
          expect(res.status).to.equal(400);
          done(err);
        });
    });


    it('Should fail to delete task', (done) => {
      const token = process.env.USER_TOKEN!;
      chai
        .request(App())
        .delete(`${baseUrl}/delete`)
        .set('Authorization', token)
        .send({
        })
        .end((err: any, res: { status: any }) => {
          expect(res.status).to.equal(400);
          done(err);
        });
    });

  //   it('Should fetch all tasks with invalid authorization', (done) => {
  //     chai
  //       .request(App())
  //       .get(`${baseUrl}/`)
  //       .send({
  //       })
  //       .end((err: any, res: { status: any }) => {
  //         expect(res.status).to.equal(401);
  //         done(err);
  //       });
  //   });

    it('Should fetch all tasks successfully', (done) => {
      const token = process.env.USER_TOKEN!;
      chai
        .request(App())
        .get(`${baseUrl}/`)
        .set('Authorization', token)
        .send({
        })
        .end((err: any, res: { status: any }) => {
          expect(res.status).to.equal(200);
          done(err);
        });
    });
  })
