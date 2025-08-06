import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from 'src/common/guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('images')
@UseGuards(AuthGuard, RoleGuard)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Roles('SUPERADMIN', 'ADMIN','WORKER', 'SELLER')
  @Post()
  @ApiOperation({ summary: 'Create a new post ✨' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        product_id: { type: 'integer' }, 
        image_url: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created 🎉',
  })
  @UseInterceptors(
    FileInterceptor('image_url', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: Infinity },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() CreateImageDto: CreateImageDto,
  ) {
    const image_url = file?.filename;
    CreateImageDto.product_id = Number(CreateImageDto.product_id);
    return this.imagesService.create(CreateImageDto, image_url);
  }
  
  
  @Get()
  findAll() {
    return this.imagesService.findAll();
  }
  
  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }
  
  @Roles('SUPERADMIN', 'ADMIN','WORKER', 'SELLER')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }
  
  @Roles('SUPERADMIN', 'ADMIN','WORKER', 'SELLER')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
