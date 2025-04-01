import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBorrowerDTO {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Acme Corporation',
  })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Number of employees in the company',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  number_of_employees: number;

  @ApiProperty({
    description: 'Name of the CEO',
    example: 'John Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  ceo?: string;

  @ApiProperty({
    description: 'Gender of the CEO',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  @IsString()
  gender_of_ceo?: string;

  @ApiProperty({
    description: 'Birth year of the CEO',
    example: 1980,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  birth_year?: number;
}
