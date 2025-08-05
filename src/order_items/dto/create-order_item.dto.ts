import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  @IsInt()
  order_id: number;

  @ApiProperty({ example: 1, description: 'Mahsulot ID', required: false })
  @IsOptional()
  @IsInt()
  product_id?: number;

  @ApiProperty({ example: 2, description: 'Servis ID', required: false })
  @IsOptional()
  @IsInt()
  service_id?: number;

  @ApiProperty({ example: 2, description: 'Miqdor (quantity)' })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 125000, description: 'Bir dona narxi (somda)' })
  @IsInt()
  unit_price: number;

  @ApiProperty({ example: 'Qadoqlashga ehtiyot boling', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
