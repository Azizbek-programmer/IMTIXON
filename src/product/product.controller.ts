import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('product')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
