import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.create({
        data: createCategoryDto,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Kategoriya muvaffaqiyatli yaratildi',
        data: category,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const categories = await this.prismaService.category.findMany({
        include: {
          products: true,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        data: categories,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!category) {
        throw new HttpException('Kategoriya topilmadi', HttpStatus.NOT_FOUND);
      }

      return { statusCode: HttpStatus.OK, data: category };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Kategoriya yangilandi',
        data: category,
      };
    } catch (error) {
      throw new HttpException('Yangilashda xatolik: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.category.delete({ where: { id } });
      return {
        statusCode: HttpStatus.OK,
        message: 'Kategoriya o‘chirildi',
      };
    } catch (error) {
      throw new HttpException('O‘chirishda xatolik: ' + error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
