import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ example: 1, description: 'Mahsulot ID' })
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Rasm URL' })
  @IsString()
  image_url: string;

  @ApiProperty({ example: 'Yon tomondan ko‘rinish', required: false })
  @IsOptional()
  @IsString()
  descriptions?: string;
}
