import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from './cats.module';
import { CatsService } from './cats.service';
import { INestApplication } from '@nestjs/common';
//import { Cat } from './interfaces/cat.interface';

describe('Cats', () => {
  let app: INestApplication;
  const catsService = {
    findAll: () => [
      { name: 'kitty', age: 3, breed: 'white cat' },
      { name: 'yoda', age: 100, breed: 'alien' },
    ],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
