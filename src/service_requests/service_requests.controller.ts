import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceRequestsService } from './service_requests.service';
import { CreateServiceRequestDto } from './dto/create-service_request.dto';
import { UpdateServiceRequestDto } from './dto/update-service_request.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('service-requests')
@UseGuards(AuthGuard, RoleGuard)
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Roles("SUPERADMIN", 'CUSTOMER')
  @Post()
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }
  
  @Get()
  findAll() {
    return this.serviceRequestsService.findAll();
  }
  
  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(+id);
  }
  
  @Roles("SUPERADMIN", 'CUSTOMER', "WORKER")
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
    return this.serviceRequestsService.update(+id, updateServiceRequestDto);
  }
  
  @Roles("SUPERADMIN", 'CUSTOMER', "WORKER")
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(+id);
  }
}
