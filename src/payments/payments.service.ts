import { PaymentStatus } from 'generated/prisma'; // Enum import qilinganiga ishonch hosil qiling
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async generateUniqueReceiptNumber(): Promise<number> {
    let receipt = 0;
    let exists = true;

    while (exists) {
      receipt = Math.floor(100000 + Math.random() * 900000); // 6 xonali random
      const existing = await this.prismaService.payments.findFirst({
        where: { receipt_number: receipt },
      });
      exists = !!existing;
    }

    return receipt;
  }

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { user_id, order_id } = createPaymentDto;

      const user = await this.prismaService.user.findUnique({
        where: { id: user_id },
      });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      const order = await this.prismaService.order.findUnique({
        where: { id: order_id },
      });
      if (!order) throw new NotFoundException('Buyurtma topilmadi');

      const receipt_number = await this.generateUniqueReceiptNumber();

      const amount = order.total_price;
      if (amount != createPaymentDto.amount)
        throw new BadRequestException(`Summa to'g'ri emas`);

      const payment = await this.prismaService.payments.create({
        data: {
          ...createPaymentDto,
          amount,
          receipt_number,
        },
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
      const payment = await this.prismaService.payments.findUnique({
        where: { id },
      });
      if (!payment) throw new NotFoundException('Tolov topilmadi');

      if (updatePaymentDto.user_id) {
        const user = await this.prismaService.user.findUnique({
          where: { id: updatePaymentDto.user_id },
        });
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (updatePaymentDto.order_id) {
        const order = await this.prismaService.order.findUnique({
          where: { id: updatePaymentDto.order_id },
        });
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
      const payment = await this.prismaService.payments.findUnique({
        where: { id },
      });
      if (!payment) throw new NotFoundException('Tolov topilmadi');

      await this.prismaService.payments.delete({ where: { id } });
      return { statusCode: 200, message: 'Tolov ochirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }



async getTopPaidByType() {
  try {
    const payments = await this.prismaService.payments.findMany({
      where: {
        status: PaymentStatus.PENDING, // ✅ ENUM orqali filter
      },
      include: {
        order: true, // ✅ orderni to‘liq chaqiramiz
      },
    });

    const statsMap: Record<string, { total_amount: number; count: number }> = {};

    for (const payment of payments) {
      const type = (payment.order as any)?.type || 'PAID'; // ✅ type mavjud bo‘lsa olib, aks holda 'UNKNOWN'

      if (!statsMap[type]) {
        statsMap[type] = { total_amount: 0, count: 0 };
      }

      statsMap[type].total_amount += payment.amount;
      statsMap[type].count += 1;
    }

    const result = Object.entries(statsMap)
      .map(([type, value]) => ({
        type,
        total_amount: value.total_amount,
        payment_count: value.count,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    return {
      statusCode: 200,
      message: 'Tolov statistikasi',
      data: result,
    };
  } catch (error) {
    console.error('Top payment type error:', error);
    throw new InternalServerErrorException('Tolov statistikasi olishda xatolik');
  }
}

}
