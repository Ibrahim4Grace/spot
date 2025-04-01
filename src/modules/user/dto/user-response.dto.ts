import { UserInterface } from '../interface/UserInterface';

import { IsEnum, IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DeactivateAccountDto {
  @ApiProperty({
    example: true,
    description: 'Confirmation to deactivate the account',
    nullable: false,
  })
  @IsBoolean()
  confirmation: boolean;
}

export class GetUserByIdResponseDto {
  status_code: 200;
  user: Omit<Partial<UserInterface>, 'password'>;

  constructor(user: Omit<Partial<UserInterface>, 'password'>) {
    this.user = user;
  }
}

export class GetUserStatsResponseDto {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 200 })
  status_code: number;

  @ApiProperty({ example: 'User statistics retrieved successfully' })
  message: string;

  @ApiProperty({
    example: {
      total_users: 100,
      active_users: 80,
      deleted_users: 20,
    },
  })
  data: {
    total_users: number;
    active_users: number;
    deleted_users: number;
  };
}

export class ReactivateAccountDto {
  @ApiProperty({
    example: true,
    description: 'Email to reactivate the account',
    nullable: false,
  })
  @IsString()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export interface UpdateUserResponseDTO {
  status: string;
  message: string;
  user: {
    id: string;
    name: string;
    phone: string;
  };
}

export enum FileFormat {
  JSON = 'json',
  XLSX = 'xlsx',
}

export class UserDataExportDto {
  @IsEnum(FileFormat)
  format: FileFormat;
}

export class UpdateUserStatusDto {
  @IsString()
  status: string;
}

class ErrorCreateUserResponse {
  status_code: number;
  message: string;
}

class SuccessCreateUserResponse {
  status_code: number;
  message: string;
  data: {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      created_at: Date;
    };
  };
}

export { ErrorCreateUserResponse, SuccessCreateUserResponse };

export type UserResponseDTO = Partial<UserInterface>;
