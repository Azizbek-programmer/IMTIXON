import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('category')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request | any,
  ) {
    const userId = req.user.id; // JWT token ichidan keladi
    return this.categoryService.create(createCategoryDto, userId);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }
  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto, 
    @Req() req: Request | any,
  ) {
    return this.categoryService.update(+id, updateCategoryDto, req.user.id);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
