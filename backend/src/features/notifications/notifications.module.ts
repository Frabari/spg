import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './services/notifications.service';
import { SendgridService } from './services/sendgrid.service';
import { TelegramService } from './services/telegram.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    TypeOrmModule.forFeature([Notification]),
  ],
  providers: [
    NotificationsGateway,
    NotificationsService,
    TelegramService,
    SendgridService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
