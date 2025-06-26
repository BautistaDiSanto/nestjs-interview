import { Injectable } from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';

@Injectable()
export class TodoListsService {
  private readonly todolists: TodoList[];

  constructor(todoLists: TodoList[] = []) {
    this.todolists = todoLists;
  }

  all(): TodoList[] {
    return this.todolists;
  }

  get(id: number): TodoList {
    let list = this.todolists.find((x) => x.id === Number(id));
    if (!list) {
      throw new Error(`Todo list with id ${id} not found`);
    }
    return list
  }

  create(dto: CreateTodoListDto): TodoList {
    const todoList: TodoList = {
      id: this.nextId(),
      name: dto.name,
    };

    this.todolists.push(todoList);

    return todoList;
  }

  update(id: number, dto: UpdateTodoListDto): TodoList {
    const todolist = this.todolists.find((x) => x.id == Number(id));

    if (!todolist) {
      throw new Error(`Todo list with id ${id} not found`);
    }
    // Update the record
    todolist.name = dto.name;

    return todolist;
  }

  delete(id: number): void {
    const index = this.todolists.findIndex((x) => x.id == Number(id));

    if (index === -1) {
      throw new Error(`Todo list with id ${id} not found`);
    }

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
