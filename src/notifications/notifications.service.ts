import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: createNotificationDto.user_id },
      });

      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      const notification = await this.prismaService.notifications.create({
        data: createNotificationDto,
      });

      return {
        statusCode: 201,
        message: 'Bildirishnoma yaratildi',
        data: notification,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findAll(userId: number) {
    try {
      const notifications = await this.prismaService.notifications.findMany({
        include: { user: true },
      });

      const unreadIds = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

      if (unreadIds.length > 0) {
        await this.prismaService.notifications.updateMany({
          where: { id: { in: unreadIds } },
          data: { is_read: true },
        });

        notifications.forEach((n) => {
          n.is_read = true;
        });
      }

      return { statusCode: 200, data: notifications };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async findOne(id: number, currentUserId: number) {
    const notification = await this.prismaService.notifications.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!notification) throw new NotFoundException('Bildirishnoma topilmadi');

    if (notification.user_id === currentUserId && !notification.is_read) {
      await this.prismaService.notifications.update({
        where: { id },
        data: { is_read: true },
      });
      notification.is_read = true;
    }

    return { statusCode: 200, data: notification };
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    try {
      const notification = await this.prismaService.notifications.findUnique({
        where: { id },
      });
      if (!notification) throw new NotFoundException('Bildirishnoma topilmadi');

      const updated = await this.prismaService.notifications.update({
        where: { id },
        data: updateNotificationDto,
      });

      return {
        statusCode: 200,
        message: 'Bildirishnoma yangilandi',
        data: updated,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }

  async remove(id: number) {
    try {
      const notification = await this.prismaService.notifications.findUnique({
        where: { id },
      });
      if (!notification) throw new NotFoundException('Bildirishnoma topilmadi');

      await this.prismaService.notifications.delete({ where: { id } });
      return { statusCode: 200, message: 'Bildirishnoma o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Server xatosi');
    }
  }
}
