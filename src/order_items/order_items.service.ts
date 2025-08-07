import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      const { order_id, product_id, service_id } = createOrderItemDto;

      const order = await this.prismaService.order.findUnique({
        where: { id: order_id },
      });
      if (!order) throw new NotFoundException('Buyurtma topilmadi');

      if (product_id) {
        const product = await this.prismaService.product.findUnique({
          where: { id: product_id },
        });
        if (!product) throw new NotFoundException('Mahsulot topilmadi');
      }

      if (service_id) {
        const service = await this.prismaService.service.findUnique({
          where: { id: service_id },
        });
        if (!service) throw new NotFoundException('Servis topilmadi');
      }

      const orderItem = await this.prismaService.order_items.create({
        data: createOrderItemDto,
      });

      return {
        statusCode: 201,
        message: 'Order item yaratildi',
        data: orderItem,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findAll() {
    try {
      const items = await this.prismaService.order_items.findMany({
        include: { order: true, product: true, service: true },
      });
      return { statusCode: 200, data: items };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findOne(id: number) {
    const item = await this.prismaService.order_items.findUnique({
      where: { id },
      include: { order: true, product: true, service: true },
    });

    if (!item) throw new NotFoundException('Order item topilmadi');

    return { statusCode: 200, data: item };
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    try {
      const item = await this.prismaService.order_items.findUnique({
        where: { id },
      });
      if (!item) throw new NotFoundException('Order item topilmadi');

      if (updateOrderItemDto.order_id) {
        const order = await this.prismaService.order.findUnique({
          where: { id: updateOrderItemDto.order_id },
        });
        if (!order) throw new NotFoundException('Buyurtma topilmadi');
      }

      if (updateOrderItemDto.product_id) {
        const product = await this.prismaService.product.findUnique({
          where: { id: updateOrderItemDto.product_id },
        });
        if (!product) throw new NotFoundException('Mahsulot topilmadi');
      }

      if (updateOrderItemDto.service_id) {
        const service = await this.prismaService.service.findUnique({
          where: { id: updateOrderItemDto.service_id },
        });
        if (!service) throw new NotFoundException('Servis topilmadi');
      }

      const updated = await this.prismaService.order_items.update({
        where: { id },
        data: updateOrderItemDto,
      });

      return {
        statusCode: 200,
        message: 'Order item yangilandi',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async remove(id: number) {
    try {
      const item = await this.prismaService.order_items.findUnique({
        where: { id },
      });
      if (!item) throw new NotFoundException('Order item topilmadi');

      await this.prismaService.order_items.delete({ where: { id } });
      return { statusCode: 200, message: 'Order item o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }
}
