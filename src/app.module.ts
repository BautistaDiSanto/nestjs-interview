import { Module } from '@nestjs/common';
import { TodoListsModule } from './todo_lists/todo_lists.module';
import { TodoItemModule } from './todo_item/todo_item.module';

@Module({
  imports: [TodoListsModule, TodoItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
