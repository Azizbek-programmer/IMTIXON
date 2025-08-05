import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ example: 1, description: 'Mahsulot ID' })
  @Type(() => Number)
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 'Yon tomondan ko‘rinish', required: false })
  @IsOptional()
  @IsString()
  descriptions?: string;
}
