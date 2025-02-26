import { IsString, IsNumber, IsOptional } from 'class-validator';

export class JobsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsNumber()
  salary: number;

  @IsString()
  category: string;
}
