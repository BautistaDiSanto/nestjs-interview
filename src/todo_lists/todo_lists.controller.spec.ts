import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo_lists.controller';
import { TodoListsService } from './todo_lists.service';

describe('TodoListsController', () => {
  let todoListService: TodoListsService;
  let todoListsController: TodoListsController;

  beforeEach(async () => {
    todoListService = new TodoListsService([
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [{ provide: TodoListsService, useValue: todoListService }],
    }).compile();

    todoListsController = app.get<TodoListsController>(TodoListsController);
  });

  describe('index', () => {
    it('should return the list of todolist', () => {
      expect(todoListsController.index()).toEqual([
        { id: 1, name: 'test1' },
        { id: 2, name: 'test2' },
      ]);
    });

    it('should return an empty array when there are no todo lists', async () => {
      // Re-instantiate with empty data
      todoListService = new TodoListsService([]);
      const app: TestingModule = await Test.createTestingModule({
        controllers: [TodoListsController],
        providers: [{ provide: TodoListsService, useValue: todoListService }],
      }).compile();
      todoListsController = app.get<TodoListsController>(TodoListsController);
      expect(todoListsController.index()).toEqual([]);
    });
  });

  describe('show', () => {
    it('should return the todolist with the given id', () => {
      expect(todoListsController.show({ todoListId: 1 })).toEqual({
        id: 1,
        name: 'test1',
      });
    });
    it('should throw NotFoundException if the list does not exist', () => {
      expect(() => todoListsController.show({ todoListId: 999 })).toThrow();
    });
    it('should throw NotFoundException if the id is not a number', () => {
      // @ts-expect-error: purposely passing invalid type
      expect(() => todoListsController.show({ todoListId: 'abc' })).toThrow();
    });
  });

  describe('create', () => {
    it('should create and return a new todo list', () => {
      const dto = { name: 'new list' };
      const result = todoListsController.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('new list');
      expect(todoListService.all().length).toBe(3);
    });
    it('should throw NotFoundException if service throws', () => {
      jest
        .spyOn(todoListService, 'create')
        .mockImplementation(() => {
          throw new Error('fail');
        });
      expect(() => todoListsController.create({ name: 'fail' })).toThrow();
    });
    it('should throw an error if body is missing', () => {
      expect(() => todoListsController.create(undefined)).toThrow();
    });
  });

  describe('update', () => {
    it('should update and return the todo list', () => {
      const dto = { name: 'updated list' };
      const result = todoListsController.update({ todoListId: 1 }, dto);
      expect(result).toEqual({ id: 1, name: 'updated list' });
      expect(todoListService.get(1).name).toBe('updated list');
    });
    it('should throw NotFoundException if the list does not exist', () => {
      const dto = { name: 'fail' };
      expect(() => todoListsController.update({ todoListId: 999 }, dto)).toThrow();
    });
    it('should throw NotFoundException if the id is not a number', () => {
      const dto = { name: 'fail' };
      // @ts-expect-error: purposely passing invalid type
      expect(() => todoListsController.update({ todoListId: 'abc' }, dto)).toThrow();
    });
    it('should throw NotFoundException if service throws', () => {
      const dto = { name: 'fail' };
      jest.spyOn(todoListService, 'update').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoListsController.update({ todoListId: 1 }, dto)).toThrow();
    });
  });

  describe('delete', () => {
    it('should delete the todo list with the given id', () => {
      todoListsController.delete({ todoListId: 1 });
      expect(todoListService.all().map((x) => x.id)).toEqual([2]);
    });
    it('should throw NotFoundException if the list does not exist', () => {
      expect(() => todoListsController.delete({ todoListId: 999 })).toThrow();
    });
    it('should throw NotFoundException if the id is not a number', () => {
      // @ts-expect-error: purposely passing invalid type
      expect(() => todoListsController.delete({ todoListId: 'abc' })).toThrow();
    });
    it('should throw NotFoundException if service throws', () => {
      jest.spyOn(todoListService, 'delete').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoListsController.delete({ todoListId: 2 })).toThrow();
    });
  });
});
