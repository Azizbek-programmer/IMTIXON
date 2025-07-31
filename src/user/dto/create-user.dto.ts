import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export enum Roles {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
  WORKER = 'WORKER',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birth_date?: Date;

  @IsEnum(Roles)
  role: Roles;

  @IsOptional()
  language_id?: number;
}
