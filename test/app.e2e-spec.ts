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

  it('학교 관리자는 지역, 학교명으로 학교 페이지를 생성할 수 있다', async () => {
    const createSchoolDtos: CreateSchoolDto[] = [
      {
        region: 'region1',
        name: 'name1',
      },
      {
        region: 'region2',
        name: 'name2',
      },
    ];

    for (const createSchoolDto of createSchoolDtos) {
      const res = await request(app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createSchoolDto)
      .expect(201);

      expect(res.body).toMatchObject(createSchoolDto);
    }
  });

  it('학교 관리자는 학교 페이지 내에 소식을 작성할 수 있다', async () => {
    const createNewsDtos: CreateNewsDto[] = [
      {
        school: 1,
        content: 'content1',
      },
      {
        school: 1,
        content: 'content2',
      },
      {
        school: 2,
        content: 'content1',
      },
      {
        school: 2,
        content: 'content2',
      },
    ];

    for (const createNewsDto of createNewsDtos) {
      const res = await request(app.getHttpServer())
      .post('/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createNewsDto)
      .expect(201);

      expect(res.body).toMatchObject(createNewsDto);
    }
  });

  it('학교 관리자는 작성된 소식을 수정할 수 있다', async () => {
    const res = await request(app.getHttpServer())
      .patch('/news/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ content: 'new content' })
      .expect(200);

    expect(res.body).toMatchObject({ content: 'new content' });
  });

  it('학교 관리자는 작성된 소식을 삭제할 수 있다', async () => {
    const res = await request(app.getHttpServer())
      .delete('/news/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ deleted: true });
  });

  it('학생은 학교 페이지를 구독할 수 있다', async () => {
    {
      const res = await request(app.getHttpServer())
        .post('/student/subscribe?school=1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      expect(res.body).toMatchObject({ school: 1, user: 1 });
    }

    {
      const res = await request(app.getHttpServer())
        .post('/student/subscribe?school=2')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(201);

      expect(res.body).toMatchObject({ school: 2, user: 1 });
    }
  });

  it('학생은 구독 중인 학교 페이지 목록을 확인할 수 있다', async () => {
    const res = await request(app.getHttpServer())
      .get('/student/subscribe')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(res.body).toMatchObject([{ school: 1, user: 1 }, { school: 2, user: 1 }]);
  });

  it('학생은 구독 중인 학교 페이지를 구독 취소할 수 있다', async () => {
    const res = await request(app.getHttpServer())
      .delete('/student/subscribe?id=1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(res.body).toMatchObject({ deleted: true });
  });

  it('학생은 구독 중인 학교 페이지별 소식을 볼 수 있다', async () => {
    {
      const res = await request(app.getHttpServer())
        .get('/student/news?school=1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toMatchObject([]);
    }

    {
      const res = await request(app.getHttpServer())
        .get('/student/news?school=2')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(res.body).toMatchObject([{ content: "content2", school: 2 }, { content: "content1", school: 2 }]);
    }
  });
});
