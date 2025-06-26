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
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoItemService } from './todo_item.service';

@Controller('api/todoItem')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Get()
  index(): TodoItem[] {
    try {
      return this.todoItemService.all();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('/:itemId')
  show(@Param('itemId') itemId: number): TodoItem {
    try {
      return this.todoItemService.get(itemId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('')
  create(@Body() dto: CreateTodoItemDto): TodoItem {
    try {
      return this.todoItemService.create(dto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put('/:itemId')
  update(
    @Param('itemId') itemId: number,
    @Body() dto: UpdateTodoItemDto,
  ): TodoItem {
    try {
      return this.todoItemService.update(itemId, dto);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('/:itemId')
  delete(@Param('itemId') itemId: number,): void {
    try {
      this.todoItemService.delete(itemId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
  @Put('/complete/:itemId')
  toggleCompleted(@Param('itemId') itemId: number): TodoItem {
    try {
      return this.todoItemService.toggleCompleted(itemId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
