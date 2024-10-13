import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsOptional()
  @IsString()
  logo?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['active', 'inactive'])
  status: string;
}
