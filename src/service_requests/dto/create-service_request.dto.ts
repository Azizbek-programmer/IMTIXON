import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { ServiceRequestStatus, ServiceRating } from 'generated/prisma'

export class CreateServiceRequestDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID' })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 2, description: 'Xizmat ID' })
  @IsInt()
  service_id: number;

  @ApiProperty({ example: '2025-08-05 14:00', description: 'Rejalashtirilgan vaqt', required: false })
  @IsOptional()
  @IsString()
  scheduled_at?: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor 5', description: 'Manzil', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 3, description: 'Texnik ID', required: false })
  @IsOptional()
  @IsInt()
  technician_id?: number;

  @ApiProperty({ example: 'NEW', enum: ServiceRequestStatus, required: false })
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @ApiProperty({ example: '75', description: 'Haqiqiy davomiylik (minut)', required: false })
  @IsOptional()
  @IsString()
  real_duration_minutes?: string;

  @ApiProperty({ example: 'FIVE', enum: ServiceRating, required: false })
  @IsOptional()
  @IsEnum(ServiceRating)
  rating?: ServiceRating;
}

export class UpdateServiceRequestDto {
  @ApiProperty({ example: 'COMPLETED', enum: ServiceRequestStatus, required: false })
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @ApiProperty({ example: 'FIVE', enum: ServiceRating, required: false })
  @IsOptional()
  @IsEnum(ServiceRating)
  rating?: ServiceRating;

  @ApiProperty({ example: '80', required: false })
  @IsOptional()
  @IsString()
  real_duration_minutes?: string;
}
