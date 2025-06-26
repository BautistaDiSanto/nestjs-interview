import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoListDto } from './dtos/create-todo_list';
import { UpdateTodoListDto } from './dtos/update-todo_list';
import { TodoList } from '../interfaces/todo_list.interface';
import { TodoListsService } from './todo_lists.service';

@Controller('api/todolists')
export class TodoListsController {
  constructor(private todoListsService: TodoListsService) {}

  @Get()
  index(): TodoList[] {
    try {
      return this.todoListsService.all();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/:todoListId')
  show(@Param() param: { todoListId: number }): TodoList {
    try {
      return this.todoListsService.get(param.todoListId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  create(@Body() dto: CreateTodoListDto): TodoList {
    try {
      return this.todoListsService.create(dto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put('/:todoListId')
  update(
    @Param() param: { todoListId: number },
    @Body() dto: UpdateTodoListDto,
  ): TodoList {
    try {
      return this.todoListsService.update(param.todoListId, dto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('/:todoListId')
  delete(@Param() param: { todoListId: number }): void {
    try {
      this.todoListsService.delete(param.todoListId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
}
