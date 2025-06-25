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
    return this.todoItemService.all();
  }

  @Get('/:itemId')
  show(@Param('itemId') itemId: number): TodoItem {
    
    return this.todoItemService.get(itemId);
  }

  @Post('/:listId')
  create(@Body() dto: CreateTodoItemDto): TodoItem {
    return this.todoItemService.create(dto);
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
    this.todoItemService.delete(itemId);
  }
  
  @Put('/complete/:itemId')
  toggleCompleted(@Param('itemId') itemId: number): TodoItem {
    return this.todoItemService.toggleCompleted(itemId);
  }
}
