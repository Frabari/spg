import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Notification]),
    MailerModule.forRoot({
      transport: {
        host: '127.0.0.1',
        port: 1025,
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: 'Basil <noreply@basil.com>',
      },
    }),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
