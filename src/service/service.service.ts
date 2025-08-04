import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const newService = await this.prisma.service.create({
        data: createServiceDto,
      });

      return {
        message: 'Xizmat muvaffaqiyatli yaratildi',
        data: newService,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Xizmat yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll() {
    try {
      const services = await this.prisma.service.findMany({
        orderBy: {
          createAt: 'desc',
        },
      });

      return {
        message: 'Barcha xizmatlar',
        data: services,
      };
    } catch (error) {
      throw new InternalServerErrorException('Xizmatlarni olishda xatolik');
    }
  }

  async findOne(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new NotFoundException('Xizmat topilmadi');
      }

      return {
        message: 'Xizmat topildi',
        data: service,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Xizmatni olishda xatolik',
      );
    }
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    try {
      const service = await this.prisma.service.findUnique({ where: { id } });

      if (!service) {
        throw new NotFoundException('Xizmat topilmadi');
      }

      const updated = await this.prisma.service.update({
        where: { id },
        data: updateServiceDto,
      });

      return {
        message: 'Xizmat muvaffaqiyatli yangilandi',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Xizmatni yangilashda xatolik',
      );
    }
  }

  async remove(id: number) {
    try {
      const service = await this.prisma.service.findUnique({ where: { id } });

      if (!service) {
        throw new NotFoundException('Xizmat topilmadi');
      }

      await this.prisma.service.delete({ where: { id } });

      return {
        message: 'Xizmat muvaffaqiyatli o‘chirildi',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Xizmatni o‘chirishda xatolik',
      );
    }
  }
}
