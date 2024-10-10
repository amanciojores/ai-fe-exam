import { IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsEnum(['writer', 'editor'])
  type?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;
}
