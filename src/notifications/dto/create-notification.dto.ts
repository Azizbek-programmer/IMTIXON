import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from 'generated/prisma'; // Prisma enum

export class CreateNotificationDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID' })
  @IsInt()
  user_id: number;

  @ApiProperty({
    example: 'Yangi buyurtma',
    description: 'Bildirishnoma sarlavhasi',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Sizning buyurtmangiz qabul qilindi',
    description: 'Xabar matni',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: 'ORDER_STATUS', enum: NotificationType })
  @IsEnum(NotificationType)
  notification_type: NotificationType;

  @ApiProperty({
    example: false,
    description: 'Oqilganligi holati',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}
