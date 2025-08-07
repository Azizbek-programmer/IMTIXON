import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { OrderStatus, OrderType, PaymentMethod } from 'generated/prisma'; // Prisma enum

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID' })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 250000, description: 'Jami summa (somda)' })
  @IsInt()
  total_price: number;

  @ApiProperty({ example: 'PENDING', enum: OrderStatus, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ example: 'PRODUCT', enum: OrderType })
  @IsEnum(OrderType)
  order_type: OrderType;

  @ApiProperty({ example: 'Toshkent, Chilonzor 5', required: false })
  @IsOptional()
  @IsString()
  delivery_address?: string;

  @ApiProperty({ example: 'CASH', enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    example: 2,
    description: 'Service ID (faqat servis buyurtmalarida)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  service_id?: number;
}
