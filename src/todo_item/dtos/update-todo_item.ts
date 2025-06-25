import { IsInt, IsString, IsBoolean } from 'class-validator';

export class UpdateTodoItemDto {
  @IsString()
  description: string;
}