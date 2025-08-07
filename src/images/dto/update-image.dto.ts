import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateImageDto } from './create-image.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto extends PartialType(CreateImageDto) {
      @ApiProperty({ example: 'Yon tomondan ko‘rinish', required: false })
  @IsOptional()
  @IsString()
  descriptions?: string;
}
