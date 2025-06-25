import { IsString } from 'class-validator';

export class UpdateTodoListDto {
  @IsString()
  name: string;
}
