import { Injectable } from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';

@Injectable()
export class TodoItemService {
  private readonly todolists: TodoItem[];

  constructor(todoLists: TodoItem[] = []) {
    this.todolists = todoLists;
  }

  all(): TodoItem[] {
    return this.todolists;
  }

  get(id: number): TodoItem {
    return this.todolists.find((x) => x.id === Number(id));
  }

  create(dto: CreateTodoItemDto): TodoItem {
    const todoList: TodoItem = {
      id: this.nextId(),
      listId: dto.listId,
      description: dto.description,
      isCompleted: dto.isCompleted,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoItemDto): TodoItem {
    const todolist = this.todolists.find((x) => x.id == Number(id));

    // Update the record
    todolist.description = dto.description;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));

    if (index > -1) {
      this.todolists.splice(index, 1);
    }
  }

  private nextId(): number {
    const last = this.todolists
      .map((x) => x.id)
      .sort()
      .reverse()[0];

    return last ? last + 1 : 1;
  }
}
