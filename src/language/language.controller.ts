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
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { AuthGuard } from 'src/common/guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('language')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @Post()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get()
  findAll() {
    return this.languageService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languageService.findOne(+id);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languageService.update(+id, updateLanguageDto);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.languageService.remove(+id);
  }
}
