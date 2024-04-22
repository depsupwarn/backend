import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSchoolDto } from '../src/schools/dto/create-school.dto';
import { CreateNewsDto } from '../src/news/dto/create-news.dto';
import * as fs from 'node:fs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../src/auth/constants';
import { Role } from '../src/roles/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken;
  let userToken;

  beforeAll(async () => {
    adminToken = new JwtService().sign({ roles: [Role.Admin] }, { secret: jwtConstants.secret });
    userToken = new JwtService().sign({ id: 1, roles: [Role.User] }, { secret: jwtConstants.secret });

    if (fs.existsSync('./test.db')) {
      fs.unlinkSync("./test.db");
    }
  });
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/schools (POST)', async () => {
    const createSchoolDto: CreateSchoolDto = {
      region: 'region',
      name: 'name',
    };

    const res = await request(app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createSchoolDto)
      .expect(201);

    expect(res.body).toMatchObject(createSchoolDto);
  });

  it('/news (POST)', async () => {
    const createNewsDto: CreateNewsDto = {
      school: 1,
      content: 'content',
    };

    const res = await request(app.getHttpServer())
      .post('/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createNewsDto)
      .expect(201);

    expect(res.body).toMatchObject(createNewsDto);
  });

  it('/news (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .patch('/news/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ content: 'new content' })
      .expect(200);

    expect(res.body).toMatchObject({ content: 'new content' });
  });

  it('/news (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/news/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ deleted: true });
  });

  it('/student/subscribe (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/student/subscribe?school=1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);

    expect(res.body).toMatchObject({ school: 1, user: 1 });
  });
});
