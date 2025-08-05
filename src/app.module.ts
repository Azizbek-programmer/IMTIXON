import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LanguageModule } from './language/language.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServiceModule } from './service/service.module';
import { ServiceRequestsModule } from './service_requests/service_requests.module';
import { ImagesModule } from './images/images.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrderModule } from './order/order.module';
import { OrderItemsModule } from './order_items/order_items.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    UserModule,
    AuthModule,
    LanguageModule,
    ReviewsModule,
    ServiceModule,
    ServiceRequestsModule,
    ImagesModule,
    ProductModule,
    CategoryModule,
    NotificationsModule,
    OrderModule,
    OrderItemsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
