import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ServiceType } from 'generated/prisma'; // Prisma enum

export class CreateServiceDto {
  @ApiProperty({ example: 'Konditsioner ornatish', description: 'Xizmat nomi' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Professional ornatish xizmati', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 150000, description: 'Xizmat narxi somda' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: '60',
    description: 'Xizmat davomiyligi (minut)',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration_minutes?: string;

  @ApiProperty({ example: 'INSTALLATION', enum: ServiceType, required: false })
  @IsOptional()
  type?: ServiceType;

  @ApiProperty({
    example: '30',
    description: 'Garantiya kunlari',
    required: false,
  })
  @IsOptional()
  @IsString()
  warranty_days?: string;
}

export class UpdateServiceDto {
  @ApiProperty({ example: 'Konditsioner ornatish', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Professional ornatish xizmati', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 200000, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiProperty({ example: '90', required: false })
  @IsOptional()
  @IsString()
  duration_minutes?: string;

  @ApiProperty({ example: 'REPAIR', enum: ServiceType, required: false })
  @IsOptional()
  type?: ServiceType;

  @ApiProperty({ example: '60', required: false })
  @IsOptional()
  @IsString()
  warranty_days?: string;
}
