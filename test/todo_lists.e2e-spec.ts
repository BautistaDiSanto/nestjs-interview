import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TodoListsModule } from '../src/todo_lists/todo_lists.module';

describe('TodoListsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoListsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/todoLists (GET) should return an empty array when no lists exist', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todoLists')
      .expect(200);
    expect(res.body).toEqual([]);
  });

  it('/api/todoLists (GET) should return an array with created lists', async () => {
    // Create a new todo list
    const createRes = await request(app.getHttpServer())
      .post('/api/todoLists')
      .send({ name: 'Test List' })
      .expect(201);
    expect(createRes.body).toHaveProperty('id');
    expect(createRes.body.name).toBe('Test List');

    // Now get all lists
    const res = await request(app.getHttpServer())
      .get('/api/todoLists')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.some((l: any) => l.name === 'Test List')).toBe(true);
  });

  it('/api/todoLists/:id (GET) should return the list with the given id', async () => {
    // Create a new todo list
    const createRes = await request(app.getHttpServer())
      .post('/api/todoLists')
      .send({ name: 'Show By Id List' })
      .expect(201);
    const id = createRes.body.id;

    // Get the list by id
    const res = await request(app.getHttpServer())
      .get(`/api/todoLists/${id}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', id);
    expect(res.body.name).toBe('Show By Id List');
  });

  it('/api/todoLists/:id (GET) should return undefined for non-existent id', async () => {
    // Try to get a list with a very high id that doesn't exist
    const res = await request(app.getHttpServer())
      .get('/api/todoLists/999')
      .expect(404);
    expect(res.body).toEqual({
      statusCode: 404,
      message: "Todo list with id 999 not found",
      error: "Not Found"
    });
  });

  it('/api/todoLists/:id (GET) should return 400 if id is not a number', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todoLists/b')
      .expect(404);
      expect(res.body).toEqual({
        statusCode: 404,
        message: "Todo list with id b not found",
        error: "Not Found"
      });
  });
});
