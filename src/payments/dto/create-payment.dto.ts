import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentStatus, PaymentType } from 'generated/prisma'; // Prisma enum

export class CreatePaymentDto {
  @ApiProperty({ example: 123456, description: 'Chek raqami', required: false })
  @IsOptional()
  @IsInt()
  receipt_number?: number;

  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID' })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 250000, description: 'Tolov summasi (somda)' })
  @IsInt()
  amount: number;

  @ApiProperty({ example: 8600123456789012, description: 'Foydalanuvchi kartasi raqami', required: false })
  @IsOptional()
  @IsInt()
  user_card?: number;

  @ApiProperty({ example: 1, description: 'Buyurtma ID' })
  @IsInt()
  order_id: number;

  @ApiProperty({ example: 'CASH', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 'PENDING', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ example: '2025-08-04T12:00:00Z', description: 'Tolov sanasi', required: false })
  @IsOptional()
  @IsDateString()
  paid_at?: string;

  @ApiProperty({ example: 'PRODUCT', enum: PaymentType })
  @IsEnum(PaymentType)
  payment_type: PaymentType;
}
