import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
