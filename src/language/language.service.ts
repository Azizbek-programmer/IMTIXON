import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDefaultLanguages() {
    try {
      const defaultLanguages = ['Uzbek', 'English', 'Russian'];

      for (const lang of defaultLanguages) {
        const exists = await this.prismaService.language.findUnique({
          where: { name: lang },
        });
        if (!exists) {
          await this.prismaService.language.create({ data: { name: lang } });
          console.log(`✅ Default language yaratildi: ${lang}`);
        } else {
          console.log(`❗ Language allaqachon mavjud: ${lang}`);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async create(createLanguageDto: CreateLanguageDto) {
    try {
      const { name } = createLanguageDto;

      const existingLanguage = await this.prismaService.language.findUnique({
        where: { name },
      });
      if (existingLanguage) {
        throw new BadRequestException('Bunday til allaqachon mavjud');
      }

      return await this.prismaService.language.create({
        data: { name },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prismaService.language.findMany({
        include: { users: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const language = await this.prismaService.language.findUnique({
        where: { id },
        include: { users: true },
      });

      if (!language) throw new NotFoundException('Bunday til topilmadi');

      return language;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto) {
    try {
      const language = await this.prismaService.language.findUnique({
        where: { id },
      });
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
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const language = await this.prismaService.language.findUnique({
        where: { id },
      });
      if (!language) throw new NotFoundException('Bunday til topilmadi');

      return await this.prismaService.language.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
