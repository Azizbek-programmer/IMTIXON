import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID' })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 5, description: 'Mahsulot ID' })
  @IsInt()
  product_id: number;

  @ApiProperty({ example: 2, description: 'Xizmat ID, optional' })
  @IsOptional()
  @IsInt()
  service_id?: number;

  @ApiProperty({ example: 4, description: 'Reyting (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Yaxshi xizmat!', description: 'Izoh, optional' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiProperty({ example: 4, description: 'Reyting (1-5)', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    example: 'Yaxshi xizmat!',
    description: 'Izoh',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
