import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname?: string;

  @IsNotEmpty()
  @IsString()
  lastname?: string;

  @IsNotEmpty()
  @IsEnum(['writer', 'editor'])
  type?: string;

  @IsNotEmpty()
  @IsEnum(['active', 'inactive'])
  status?: string;
}
