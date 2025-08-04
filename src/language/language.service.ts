import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createLanguageDto: CreateLanguageDto) {
    const { name } = createLanguageDto;

    const existingLanguage = await this.prismaService.language.findUnique({ where: { name } });
    if (existingLanguage) {
      throw new BadRequestException('Bunday til allaqachon mavjud');
    }

    return await this.prismaService.language.create({
      data: { name },
    });
  }

  async findAll() {
    return await this.prismaService.language.findMany({
      include: { users: true }, // Agar userlar bilan birga ko‘rsatmoqchi bo‘lsang
    });
  }

  async findOne(id: number) {
    const language = await this.prismaService.language.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!language) throw new NotFoundException('Bunday til topilmadi');

    return language;
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto) {
    const language = await this.prismaService.language.findUnique({ where: { id } });
    if (!language) throw new NotFoundException('Bunday til topilmadi');

    if (updateLanguageDto.name) {
      const existing = await this.prismaService.language.findUnique({
        where: { name: updateLanguageDto.name },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Bu til nomi allaqachon mavjud');
      }
    }

    return await this.prismaService.language.update({
      where: { id },
      data: updateLanguageDto,
    });
  }

  async remove(id: number) {
    const language = await this.prismaService.language.findUnique({ where: { id } });
    if (!language) throw new NotFoundException('Bunday til topilmadi');

    return await this.prismaService.language.delete({ where: { id } });
  }
}
