import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
  show(@Param('itemId', ParseIntPipe) itemId: number): TodoItem {
    return this.todoItemService.get(itemId);
  }

  @Post('')
  create(@Body() dto: CreateTodoItemDto): TodoItem {
    return this.todoItemService.create(dto);
  }

  @Put('/:itemId')
  update(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateTodoItemDto,
  ): TodoItem {
    return this.todoItemService.update(itemId, dto);
  }

  @Delete('/:itemId')
  delete(@Param('itemId', ParseIntPipe) itemId: number): void {
    this.todoItemService.delete(itemId);
  }
  
  @Put('/complete/:itemId')
  toggleCompleted(@Param('itemId', ParseIntPipe) itemId: number): TodoItem {
    return this.todoItemService.toggleCompleted(itemId);
  }
}
