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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { SelfGuard } from 'src/common/guard/self.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payments')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  
  @Get('top-paid')
async getTopPaidByType() {
  return this.paymentsService.getTopPaidByType();
}
  @Roles('SUPERADMIN', 'CUSTOMER', 'ADMIN')
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Roles('SUPERADMIN', 'CUSTOMER', 'ADMIN')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Roles('SUPERADMIN', 'CUSTOMER', 'ADMIN')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }


}
