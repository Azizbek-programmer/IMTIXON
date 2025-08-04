import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Yotoqxona', description: 'Kategoriya nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Yotoqxona uchun mebellar', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
