import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ProductColor } from 'generated/prisma';

export class CreateProductDto {
  @ApiProperty({ example: 'Yotoq karavoti', description: 'Mahsulot nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Yogochdan ishlangan, qulay karavot', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1500000, description: 'Narxi somda' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Ombordagi soni' })
  @IsInt()
  @Min(0)
  stock_quantity: number;

  @ApiProperty({ example: '200x180x40', description: 'Olchamlari', required: false })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({ example: 'BLACK', enum: ProductColor, description: 'Rangi' })
  @IsEnum(ProductColor)
  color: ProductColor;

  @ApiProperty({ example: 1, description: 'Kategoriya ID' })
  @IsInt()
  category_id: number;
}
