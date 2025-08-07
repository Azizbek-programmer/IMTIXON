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
import { OrderItemsService } from './order_items.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { SelfGuard } from 'src/common/guard/self.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('order-items')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Roles('SUPERADMIN', 'CUSTOMER')
  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }
  @UseGuards(SelfGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(+id);
  }

  @Roles('SUPERADMIN', 'CUSTOMER', 'ADMIN')
  @UseGuards(SelfGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Roles('SUPERADMIN', 'CUSTOMER', 'ADMIN')
  @UseGuards(SelfGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
