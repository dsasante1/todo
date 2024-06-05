import chai from 'chai';
import chaiHttp from 'chai-http';
import App from '../../../config/express';


const { expect } = chai;
chai.use(chaiHttp);
const baseUrl = '/api/v1/user';

describe('User Routes', () => {
  it('Should create user', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/`)
      .send({
        data: {
          first_name: 'test110g',
          last_name: 'lastname',
          email: 'test1@gmail.com',
          password: 'Test1@F007',
        },
      });

    process.env.USER_EMAIL = result.body.data.email;
    process.env.USER_TOKEN = result.body.data.token;
    process.env.USER_ID = result.body.data.id;
    expect(result.body).to.have.property('status', 'success');
    expect(result.status).to.eql(200);
  });
  it('Should create second user', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/`)
      .send({
        data: {
          first_name: 'test10g',
          last_name: 'another one',
          email: 'tes2@gmail.com',
          password: 'Test@F007',
       
        },
      });

    process.env.SECOND_USER_EMAIL = result.body.data.email;
    process.env.SECOND_USER_TOKEN = result.body.data.token;
    process.env.SECOND_USER_ID = result.body.data.id;

  
    expect(result.body).to.have.property('status', 'success');
    expect(result.status).to.eql(200);
  });
  it('Should create third user', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/`)
      .send({
        data: {
          first_name: 'test160g',
          last_name: 'thrid name',
          email: 'tes3@gmail.com',
        password: 'Test1@F007',
      
        },
      });
    process.env.THIRD_USER_EMAIL = result.body.data.email;
    process.env.THIRD_USER_TOKEN = result.body.data.token;
    process.env.THIRD_USER_ID = result.body.data.id;

    expect(result.body).to.have.property('status', 'success');
    expect(result.status).to.eql(200);
  });
  it('Should fail create user: If email already exists', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/`)
      .send({
        data: {
          user_name: 'dami10g',
          email: process.env.USER_EMAIL,
          password: 'dami@F007',
        },
      });
    expect(result.body).to.have.property('status', 'error');
    expect(result.status).to.eql(400);
  });

  it('Should login user successfully', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/login`)
      .send({
 
        email: 'tes3@gmail.com',
        password: 'Test1@F007',

      });
    expect(result.body).to.have.property('status', 'success');
    expect(result.status).to.eql(200);
  });

  it('Should fail to login user', async () => {
    const result = await chai
      .request(App())
      .post(`${baseUrl}/login`)
      .send({
        data: {
          email: process.env.USER_EMAIL,
          password: 'dami@F0047',
        },
      });
    expect(result.body).to.have.property('status', 'error');
    expect(result.status).to.eql(403);
  });

});

