import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TodoItemModule } from '../src/todo_item/todo_item.module';

describe('TodoItemController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoItemModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/todoItem', () => {
    it('should return an array (empty or with items)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/todoItem')
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return an array with created items', async () => {
      const dto = { listId: 1, description: 'desc' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(dto)
        .expect(201);
      expect(createRes.body).toHaveProperty('id');
      expect(createRes.body.description).toBe(dto.description);

      const res = await request(app.getHttpServer())
        .get('/api/todoItem')
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createRes.body.id,
            listId: createRes.body.listId,
            description: createRes.body.description,
            isCompleted: false
          }),
        ]),
      );
    });
  });

  describe('GET /api/todoItem/:itemId', () => {
    it('should return the item with the given id', async () => {
      const dto = { listId: 1, description: 'get by id' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(dto)
        .expect(201);
      const id = createRes.body.id;

      const res = await request(app.getHttpServer())
        .get(`/api/todoItem/${id}`)
        .expect(200);
      expect(res.body).toEqual(expect.objectContaining({
        id,
        listId: createRes.body.listId,
        description: createRes.body.description,
        isCompleted: false,
      }));
    });

    it('should return 200 for non-existent id with empty body', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/todoItem/99999')
        .expect(200);
    });

    it('should return 400 for invalid id (not a number)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/todoItem/notanumber')
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('POST /api/todoItem', () => {
    it('should create a todo item with valid data', async () => {
      const dto = { listId: 1, description: 'created by post'};
      const res = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(dto)
        .expect(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.listId).toBe(dto.listId);
      expect(res.body.description).toBe(dto.description);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send({})
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 400 if listId is not a number', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send({ listId: 'notanumber', description: 'invalid listId' })
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('PUT /api/todoItem/:itemId', () => {
    it('should update a todo item with valid data', async () => {
      // Create a new todo item
      const createDto = { listId: 1, description: 'to update' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(createDto)
        .expect(201);
      const id = createRes.body.id;

      // Update the item
      const updateDto = { description: 'updated' };
      const updateRes = await request(app.getHttpServer())
        .put(`/api/todoItem/${id}`)
        .send(updateDto)
        .expect(200);
      expect(updateRes.body).toEqual(expect.objectContaining({
        id,
        listId: createRes.body.listId,
        description: updateDto.description,
        isCompleted: false,
      }));
    });

    it('should return 400 if update data is invalid', async () => {
      // Create a new todo item
      const createDto = { listId: 1, description: 'to update invalid' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(createDto)
        .expect(201);
      const id = createRes.body.id;

      // Try to update with invalid data
      const res = await request(app.getHttpServer())
        .put(`/api/todoItem/${id}`)
        .send({ description: 123 }) // invalid type
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/todoItem/99999')
        .send({ description: 'does not exist' })
        .expect(404);
      expect(res.body).toHaveProperty('statusCode', 404);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 400 if itemId is not a number', async () => {
      const res = await request(app.getHttpServer())
        .put('/api/todoItem/notanumber')
        .send({ description: 'invalid id' })
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });
  });

  describe('DELETE /api/todoItem/:itemId', () => {
    it('should return 404 if id not found', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/todoItem/99999')
        .expect(404);
      expect(res.body).toHaveProperty('statusCode', 404);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Not Found');
    });

    it('should return 400 if id is not a number', async () => {
      const res = await request(app.getHttpServer())
        .delete('/api/todoItem/notanumber')
        .expect(400);
      expect(res.body).toHaveProperty('statusCode', 400);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('error', 'Bad Request');
    });

    it('should delete the item if id is found', async () => {
      // Create a new todo item
      const createDto = { listId: 1, description: 'to delete' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(createDto)
        .expect(201);
      const id = createRes.body.id;

      // Delete the item
      await request(app.getHttpServer())
        .delete(`/api/todoItem/${id}`)
        .expect(200);
    });

    it('should be idempotent if deleting the same id twice', async () => {
      // Create a new todo item
      const createDto = { listId: 1, description: 'to delete twice' };
      const createRes = await request(app.getHttpServer())
        .post('/api/todoItem')
        .send(createDto)
        .expect(201);
      const id = createRes.body.id;

      // Delete the item
      await request(app.getHttpServer())
        .delete(`/api/todoItem/${id}`)
        .expect(200);
    });
  });

});
