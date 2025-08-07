import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}


    async createDefaultCategories() {
  try {
    const existing = await this.prismaService.category.findMany();

    if (existing.length > 0) {
      console.log('❗ Kategoriyalar allaqachon mavjud');
      return existing;
    }

    const defaultCategories = [
      {
        name: 'Oshxona mebellari',
        description: 'Zamonaviy oshxona uchun maxsus mebellar',
      },
      {
        name: 'Yotoqxona mebellari',
        description: 'Yotoq uchun toplamlar va qulay mebellar',
      },
      {
        name: 'Ofis mebellari',
        description: 'Ofis uchun stollar, stullar, javonlar',
      },
    ];

    const categories = await this.prismaService.category.createMany({
      data: defaultCategories,
      skipDuplicates: true, // agar nomlari bir xil bo‘lsa, o'tkazib yuboradi
    });

    console.log(`✅ ${categories.count} ta default kategoriya yaratildi`);
    return categories;
  } catch (error) {
    throw new Error('Default kategoriyalarni yaratishda xatolik: ' + error.message);
  }
}



async create(createCategoryDto: CreateCategoryDto, userId: number) {
  const category = await this.prismaService.category.create({
    data: createCategoryDto,
  });


  return {
    statusCode: HttpStatus.CREATED,
    message: 'Kategoriya muvaffaqiyatli yaratildi',
    data: category,
  };
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto, userId: number) {
    try {
      const oldCategory = await this.prismaService.category.findUnique({
        where: { id },
      });
      if (!oldCategory) throw new NotFoundException('Category topilmadi');

      // (Request as any).oldEntity = oldCategory;

      
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
      throw new HttpException(
        'Yangilashda xatolik: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  async remove(id: number) {
    try {
      const oldCategory = await this.prismaService.category.findUnique({
        where: { id },
      });
      if (!oldCategory) throw new NotFoundException('Category topilmadi');
    
      (Request as any).oldEntity = oldCategory;

      await this.prismaService.category.delete({ where: { id } });
      return {
        statusCode: HttpStatus.OK,
        message: 'Kategoriya o‘chirildi',
      };
    } catch (error) {
      throw new HttpException(
        'O‘chirishda xatolik: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
