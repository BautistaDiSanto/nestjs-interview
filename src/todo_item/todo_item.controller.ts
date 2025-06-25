import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoItemDto } from './dtos/create-todo_item';
import { UpdateTodoItemDto } from './dtos/update-todo_item';
import { TodoItem } from '../interfaces/todo_item.interface';
import { TodoItemService } from './todo_item.service';

@Controller('api/todoItem')
export class TodoItemController {
  constructor(private todoListsService: TodoItemService) {}

  @Get()
  index(): TodoItem[] {
    return this.todoListsService.all();
  }

  @Get('/:itemId')
  show(@Param('itemId') itemId: number): TodoItem {
    
    return this.todoListsService.get(itemId);
  }

  @Post('/:listId')
  create(@Body() dto: CreateTodoItemDto): TodoItem {
    console.log('create list item');
    return this.todoListsService.create(dto);
  }

  @Put('/:itemId')
  update(
    @Param('itemId') itemId: number,
    @Body() dto: UpdateTodoItemDto,
  ): TodoItem {
    console.log('update list item', itemId, dto);
    return this.todoListsService.update(itemId, dto);
  }

  @Delete('/:itemId')
  delete(@Param('itemId') itemId: number,): void {
    this.todoListsService.delete(itemId);
  }
  
}
