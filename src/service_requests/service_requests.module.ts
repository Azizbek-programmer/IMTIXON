import { Module } from '@nestjs/common';
import { ServiceRequestsService } from './service_requests.service';
import { ServiceRequestsController } from './service_requests.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
  exports: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
