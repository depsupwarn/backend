import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateSchoolDto } from '../src/schools/dto/create-school.dto';
import * as fs from 'node:fs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../src/auth/constants';
import { Role } from '../src/roles/role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken;

  beforeAll(async () => {
    adminToken = new JwtService().sign({ roles: [Role.Admin] }, { secret: jwtConstants.secret });

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

  it('/schools (POST)', () => {
    const createSchoolDto: CreateSchoolDto = {
      region: 'region',
      name: 'name',
    };

    return request(app.getHttpServer())
      .post('/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createSchoolDto)
      .expect(201);
  });
});
