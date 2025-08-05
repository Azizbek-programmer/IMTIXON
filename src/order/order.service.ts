import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id: createOrderDto.user_id } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      if (createOrderDto.service_id) {
        const service = await this.prismaService.service.findUnique({ where: { id: createOrderDto.service_id } });
        if (!service) throw new NotFoundException('Servis topilmadi');
      }

      const order = await this.prismaService.order.create({ data: createOrderDto });

      return { statusCode: 201, message: 'Buyurtma yaratildi', data: order };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findAll() {
    try {
      const orders = await this.prismaService.order.findMany({
        include: { user: true, service: true, orderItems: true, payments: true },
      });
      return { statusCode: 200, data: orders };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findUnique({
      where: { id },
      include: { user: true, service: true, orderItems: true, payments: true },
    });

    if (!order) throw new NotFoundException('Buyurtma topilmadi');

    return { statusCode: 200, data: order };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.prismaService.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Buyurtma topilmadi');

      if (updateOrderDto.user_id) {
        const user = await this.prismaService.user.findUnique({ where: { id: updateOrderDto.user_id } });
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (updateOrderDto.service_id) {
        const service = await this.prismaService.service.findUnique({ where: { id: updateOrderDto.service_id } });
        if (!service) throw new NotFoundException('Servis topilmadi');
      }

      const updated = await this.prismaService.order.update({
        where: { id },
        data: updateOrderDto,
      });

      return { statusCode: 200, message: 'Buyurtma yangilandi', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async remove(id: number) {
    try {
      const order = await this.prismaService.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Buyurtma topilmadi');

      await this.prismaService.order.delete({ where: { id } });
      return { statusCode: 200, message: 'Buyurtma ochirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }
}
