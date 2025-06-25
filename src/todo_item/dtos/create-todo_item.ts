import { IsInt, IsString, IsBoolean } from 'class-validator';

export class CreateTodoItemDto {

  @IsInt()
  listId: number;

  @IsString()
  description: string;

}