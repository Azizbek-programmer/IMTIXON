import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id: createProductDto.category_id },
      });
      if (!category) {
        throw new HttpException('Kategoriya topilmadi', HttpStatus.NOT_FOUND);
      }

      const product = await this.prismaService.product.create({
        data: createProductDto,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Mahsulot muvaffaqiyatli yaratildi',
        data: product,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const products = await this.prismaService.product.findMany({
        include: { category: true, images: true, reviews: true },
      });
      return { statusCode: HttpStatus.OK, data: products };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id },
        include: { category: true, images: true, reviews: true },
      });

      if (!product) {
        throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
      }

      return { statusCode: HttpStatus.OK, data: product };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      if (updateProductDto.category_id) {
        const category = await this.prismaService.category.findUnique({
          where: { id: updateProductDto.category_id },
        });
        if (!category) {
          throw new HttpException('Kategoriya topilmadi', HttpStatus.NOT_FOUND);
        }
      }

      const product = await this.prismaService.product.update({
        where: { id },
        data: updateProductDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Mahsulot yangilandi',
        data: product,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.product.delete({ where: { id } });
      return {
        statusCode: HttpStatus.OK,
        message: 'Mahsulot o‘chirildi',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
