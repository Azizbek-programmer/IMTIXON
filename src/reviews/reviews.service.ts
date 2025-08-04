import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const { user_id, product_id, service_id } = createReviewDto;

    try {
      const userExists = await this.prisma.user.findUnique({ where: { id: user_id } });
      if (!userExists) throw new NotFoundException('Foydalanuvchi topilmadi');

      const productExists = await this.prisma.product.findUnique({ where: { id: product_id } });
      if (!productExists) throw new NotFoundException('Mahsulot topilmadi');

      if (service_id) {
        const serviceExists = await this.prisma.service.findUnique({ where: { id: service_id } });
        if (!serviceExists) throw new NotFoundException('Xizmat topilmadi');
      }

      const newReview = await this.prisma.reviews.create({
        data: createReviewDto,
      });

      return { message: 'Review muvaffaqiyatli yaratildi', data: newReview };
    } catch (error) {
      console.error('Review create error:', error);
      throw new InternalServerErrorException(error.message || 'Server xatoligi');
    }
  }

  async findAll() {
    try {
      return await this.prisma.reviews.findMany({
        include: {
          user: true,
          product: true,
          service: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Reviewlarni olishda xatolik');
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.prisma.reviews.findUnique({
        where: { id },
        include: {
          user: true,
          product: true,
          service: true,
        },
      });

      if (!review) throw new NotFoundException('Review topilmadi');

      return review;
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Reviewni olishda xatolik');
    }
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.prisma.reviews.findUnique({ where: { id } });
      if (!review) throw new NotFoundException('Review topilmadi');

      const updated = await this.prisma.reviews.update({
        where: { id },
        data: updateReviewDto,
      });

      return { message: 'Review muvaffaqiyatli yangilandi', data: updated };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Reviewni yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      const review = await this.prisma.reviews.findUnique({ where: { id } });
      if (!review) throw new NotFoundException('Review topilmadi');

      await this.prisma.reviews.delete({ where: { id } });

      return { message: 'Review muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Reviewni o‘chirishda xatolik');
    }
  }
}
