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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('reviews')
@UseGuards(AuthGuard, RoleGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  
  @Roles('SUPERADMIN', 'ADMIN')
  @Get('top-rated')
  findTopRated() {
  return this.reviewsService.getTopRatedReviewsByProductOrService();
  }

  @Roles('SUPERADMIN', 'CUSTOMER')
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @UseGuards(SelfGuard)
  @Roles('SUPERADMIN', 'CUSTOMER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(SelfGuard)
  @Roles('SUPERADMIN', 'CUSTOMER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
  
}
