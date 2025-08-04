import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty({ message: 'Language name bo‘sh bo‘lishi mumkin emas' })
  @IsString({ message: 'Language name faqat string bo‘lishi kerak' })
  @MaxLength(50, { message: 'Language name 50 belgidan oshmasligi kerak' })
  name: string;
}

