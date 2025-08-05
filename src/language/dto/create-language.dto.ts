import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty({ message: 'Language name bosh bolishi mumkin emas' })
  @IsString({ message: 'Language name faqat string bolishi kerak' })
  @MaxLength(50, { message: 'Language name 50 belgidan oshmasligi kerak' })
  name: string;
}

