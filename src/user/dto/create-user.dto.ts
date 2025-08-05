import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Roles {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  WORKER = 'WORKER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Abdulaziz Abdusodiqov', description: 'Foydalanuvchining to‘liq ismi' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Foydalanuvchi email manzili' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'Foydalanuvchi paroli' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'Parolni tasdiqlash (front uchun)' })
  @IsString()
  readonly confirm_password: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Telefon raqami' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: Roles, example: Roles.CUSTOMER, description: 'Foydalanuvchi roli (ixtiyoriy)' })
  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;

  @ApiPropertyOptional({ example: 1, description: 'Til ID (agar kerak bo‘lsa)' })
  @IsOptional()
  language_id?: number;
}
