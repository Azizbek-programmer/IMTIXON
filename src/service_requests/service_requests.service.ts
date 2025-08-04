import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service_request.dto';
import { UpdateServiceRequestDto } from './dto/create-service_request.dto'; 

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateServiceRequestDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: createDto.user_id },
      });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      const service = await this.prisma.service.findUnique({
        where: { id: createDto.service_id },
      });
      if (!service) throw new NotFoundException('Xizmat topilmadi');

      if (createDto.technician_id) {
        const technician = await this.prisma.user.findUnique({
          where: { id: createDto.technician_id },
        });
        if (!technician) throw new NotFoundException('Texnik topilmadi');
      }

      const newRequest = await this.prisma.service_requests.create({
        data: createDto,
      });

      return {
        message: 'Xizmat sorovi muvaffaqiyatli yaratildi',
        data: newRequest,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Sorov yaratishda xatolik',
      );
    }
  }

  async findAll() {
    try {
      const requests = await this.prisma.service_requests.findMany({
        include: {
          user: true,
          service: true,
          technician: true,
        },
        orderBy: {
          createAt: 'desc',
        },
      });

      return {
        message: 'Barcha xizmat sorovlari',
        data: requests,
      };
    } catch (error) {
      throw new InternalServerErrorException('Sorovlarni olishda xatolik');
    }
  }

  async findOne(id: number) {
    try {
      const request = await this.prisma.service_requests.findUnique({
        where: { id },
        include: {
          user: true,
          service: true,
          technician: true,
        },
      });

      if (!request) throw new NotFoundException('Xizmat sorovi topilmadi');

      return {
        message: 'Xizmat sorovi topildi',
        data: request,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Sorovni olishda xatolik',
      );
    }
  }

  async update(id: number, updateDto: UpdateServiceRequestDto) {
    try {
      const request = await this.prisma.service_requests.findUnique({
        where: { id },
      });
      if (!request) throw new NotFoundException('Xizmat sorovi topilmadi');

      const updated = await this.prisma.service_requests.update({
        where: { id },
        data: updateDto,
      });

      return {
        message: 'Xizmat sorovi yangilandi',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Sorovni yangilashda xatolik',
      );
    }
  }

  async remove(id: number) {
    try {
      const request = await this.prisma.service_requests.findUnique({
        where: { id },
      });
      if (!request) throw new NotFoundException('Xizmat sorovi topilmadi');

      await this.prisma.service_requests.delete({
        where: { id },
      });

      return { message: 'Xizmat sorovi ochirildi' };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Sorovni ochirishda xatolik',
      );
    }
  }
}
