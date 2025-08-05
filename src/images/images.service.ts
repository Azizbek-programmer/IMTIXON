import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prismaService: PrismaService,) {}

  async create(createImageDto: CreateImageDto, image_url: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: createImageDto.product_id },
      });
      if (!product) {
        throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
      }

      if (!image_url || image_url.trim() === '') {
        throw new BadRequestException('Rasm (image_url) yuborilishi shart');
      }

      const image = await this.prismaService.images.create({
        data: {
          image_url,
          product: {
            connect: { id: createImageDto.product_id }, 
          },
      },
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Rasm muvaffaqiyatli qo‘shildi',
        data: image,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const images = await this.prismaService.images.findMany({
        include: { product: true },
      });
      return { statusCode: HttpStatus.OK, data: images };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const image = await this.prismaService.images.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!image) {
        throw new HttpException('Rasm topilmadi', HttpStatus.NOT_FOUND);
      }

      return { statusCode: HttpStatus.OK, data: image };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    try {
      if (updateImageDto.product_id) {
        const product = await this.prismaService.product.findUnique({
          where: { id: updateImageDto.product_id },
        });
        if (!product) {
          throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
        }
      }

      const image = await this.prismaService.images.update({
        where: { id },
        data: updateImageDto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Rasm yangilandi',
        data: image,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.prismaService.images.delete({ where: { id } });
      return {
        statusCode: HttpStatus.OK,
        message: 'Rasm o‘chirildi',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
