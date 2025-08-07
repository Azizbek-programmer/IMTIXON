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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('service')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Roles('SUPERADMIN', 'ADMIN', 'WORKER', 'SELLER')
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Roles('SUPERADMIN', 'ADMIN', 'WORKER')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Roles('SUPERADMIN', 'ADMIN', 'WORKER')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
