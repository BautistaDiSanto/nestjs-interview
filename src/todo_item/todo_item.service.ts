import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoItemService {
  private readonly todoItem: TodoItem[];

  constructor(todoItem: TodoItem[] = []) {
    this.todoItem = todoItem;
  }

  all(): TodoItem[] {
    return this.todoItem;
  }

  get(id: number): TodoItem {
    return this.todoItem.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoItemDto): TodoItem {
    const todoList: TodoItem = {
      id: this.nextId(),
      listId: dto.listId,
      description: dto.description,
      isCompleted: false,
    };

    this.todoItem.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoItemDto): TodoItem {
    const todolist = this.todoItem.find((x) => x.id == Number(id));
    if (!todolist) {
      throw new NotFoundException(`Todo item with id ${id} not found`);
    } else {
      // Update the record
      todolist.description = dto.description;
  
      return todolist;
    }
  }

  delete(id: number): void {
    const index = this.todoItem.findIndex((x) => x.id == Number(id));
    if (index === -1) {
      throw new NotFoundException(`Todo item with id ${id} not found`);
    }

    if (index > -1) {
      this.todoItem.splice(index, 1);
    }
  }

  toggleCompleted(id: number): TodoItem {
    const todoItem = this.todoItem.find((x) => x.id === Number(id));
    if (todoItem) {
      todoItem.isCompleted = !todoItem.isCompleted;
    }
    return todoItem;
  }

  private nextId(): number {
    const last = this.todoItem
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
