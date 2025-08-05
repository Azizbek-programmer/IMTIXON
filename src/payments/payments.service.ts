import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { user_id, order_id } = createPaymentDto;

      const user = await this.prismaService.user.findUnique({ where: { id: user_id } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      const order = await this.prismaService.order.findUnique({ where: { id: order_id } });
      if (!order) throw new NotFoundException('Buyurtma topilmadi');

      const payment = await this.prismaService.payments.create({
        data: createPaymentDto,
      });

      return { statusCode: 201, message: 'Tolov yaratildi', data: payment };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findAll() {
    try {
      const payments = await this.prismaService.payments.findMany({
        include: { user: true, order: true },
      });
      return { statusCode: 200, data: payments };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findOne(id: number) {
    const payment = await this.prismaService.payments.findUnique({
      where: { id },
      include: { user: true, order: true },
    });

    if (!payment) throw new NotFoundException('Tolov topilmadi');

    return { statusCode: 200, data: payment };
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.prismaService.payments.findUnique({ where: { id } });
      if (!payment) throw new NotFoundException('Tolov topilmadi');

      if (updatePaymentDto.user_id) {
        const user = await this.prismaService.user.findUnique({ where: { id: updatePaymentDto.user_id } });
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (updatePaymentDto.order_id) {
        const order = await this.prismaService.order.findUnique({ where: { id: updatePaymentDto.order_id } });
        if (!order) throw new NotFoundException('Buyurtma topilmadi');
      }

      const updated = await this.prismaService.payments.update({
        where: { id },
        data: updatePaymentDto,
      });

      return { statusCode: 200, message: 'Tolov yangilandi', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.prismaService.payments.findUnique({ where: { id } });
      if (!payment) throw new NotFoundException('Tolov topilmadi');

      await this.prismaService.payments.delete({ where: { id } });
      return { statusCode: 200, message: 'Tolov ochirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }
}
