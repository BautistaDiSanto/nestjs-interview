import { Test, TestingModule } from '@nestjs/testing';
import { TodoItemController } from './todo_item.controller';
import { TodoItemService } from './todo_item.service';

describe('TodoItemController', () => {
  let todoItemService: TodoItemService;
  let todoItemController: TodoItemController;

  beforeEach(async () => {
    todoItemService = new TodoItemService([
      { id: 1, listId: 1, description: 'item1', isCompleted: false },
      { id: 2, listId: 1, description: 'item2', isCompleted: true },
    ]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodoItemController],
      providers: [{ provide: TodoItemService, useValue: todoItemService }],
    }).compile();

    todoItemController = app.get<TodoItemController>(TodoItemController);
  });

  describe('index', () => {
    it('should return the list of todo items', () => {
      expect(todoItemController.index()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should return an empty array when there are no todo items', async () => {
      todoItemService = new TodoItemService([]);
      const app: TestingModule = await Test.createTestingModule({
        controllers: [TodoItemController],
        providers: [{ provide: TodoItemService, useValue: todoItemService }],
      }).compile();
      todoItemController = app.get<TodoItemController>(TodoItemController);
      expect(todoItemController.index()).toEqual([]);
    });
  });

  describe('show', () => {
    it('should return the todo item with the given id', () => {
      expect(todoItemController.show(1)).toEqual({ id: 1, listId: 1, description: 'item1', isCompleted: false });
    });
    it('should return undefined if the item does not exist', () => {
      expect(todoItemController.show(999)).toBeUndefined();
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should return undefined if the id is not a number', () => {
      // @ts-expect-error: purposely passing invalid type
      expect(todoItemController.show('abc')).toBeUndefined();
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
  });

  describe('create', () => {
    it('should create and return a new todo item', () => {
      const dto = { listId: 1, description: 'new item' };
      const result = todoItemController.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.listId).toBe(1);
      expect(result.description).toBe('new item');
      expect(result.isCompleted).toBe(false);
      expect(todoItemService.all().length).toBe(3);
    });
    it('should throw if service throws', () => {
      jest.spyOn(todoItemService, 'create').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoItemController.create({ listId: 1, description: 'fail' })).toThrow();
    });
    it('should throw if dto is missing', () => {
      expect(() => todoItemController.create(undefined)).toThrow();
    });
  });

  describe('update', () => {
    it('should update and return the todo item', () => {
      const dto = { description: 'updated item' };
      const result = todoItemController.update(1, dto);
      expect(result).toEqual({ id: 1, listId: 1, description: 'updated item', isCompleted: false });
      expect(todoItemService.get(1).description).toBe('updated item');
    });
    it('should throw if the item does not exist', () => {
      const dto = { description: 'fail' };
      expect(() => todoItemController.update(999, dto)).toThrow();
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
      expect(todoItemController.show(999)).toBeUndefined();
    });
    it('should throw if the id is not a number', () => {
      const dto = { description: 'fail' };
      // @ts-expect-error: purposely passing invalid type
      expect(() => todoItemController.update('abc', dto)).toThrow();
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should throw if service throws', () => {
      const dto = { description: 'fail' };
      jest.spyOn(todoItemService, 'update').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoItemController.update(1, dto)).toThrow();
    });
  });

  describe('delete', () => {
    it('should delete the todo item with the given id', () => {
      todoItemController.delete(1);
      expect(todoItemService.all()).toEqual([
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should throw 404 if the item does not exist', () => {
      expect(() => todoItemController.delete(999)).toThrowError('Todo item with id 999 not found');
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should throw 404 if the id is not a number', () => {
      // @ts-expect-error: purposely passing invalid type
      expect(() => todoItemController.delete('abc')).toThrowError('Todo item with id abc not found');
      expect(todoItemService.all()).toEqual([
        { id: 1, listId: 1, description: 'item1', isCompleted: false },
        { id: 2, listId: 1, description: 'item2', isCompleted: true },
      ]);
    });
    it('should throw if service throws', () => {
      jest.spyOn(todoItemService, 'delete').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoItemController.delete(1)).toThrow();
    });
  });

  describe('toggleCompleted', () => {
    it('should toggle the completed status of the todo item', () => {
      const result = todoItemController.toggleCompleted(1);
      expect(result.isCompleted).toBe(true);
      const toggledBack = todoItemController.toggleCompleted(1);
      expect(toggledBack.isCompleted).toBe(false);
    });
    it('should return undefined if the item does not exist', () => {
      expect(todoItemController.toggleCompleted(999)).toBeUndefined();
    });
    it('should return undefined if the id is not a number', () => {
      // @ts-expect-error: purposely passing invalid type
      expect(todoItemController.toggleCompleted('abc')).toBeUndefined();
    });
    it('should throw if service throws', () => {
      jest.spyOn(todoItemService, 'toggleCompleted').mockImplementation(() => { throw new Error('fail'); });
      expect(() => todoItemController.toggleCompleted(1)).toThrow();
    });
  });
});
