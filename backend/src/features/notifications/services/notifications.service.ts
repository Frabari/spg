import { FindConditions, Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserId } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import {
  Notification,
  NotificationPriority,
  NotificationType,
} from '../entities/notification.entity';
import { NotificationsGateway } from '../notifications.gateway';
import { SendgridService } from './sendgrid.service';

@Injectable()
export class NotificationsService {
  private activeUserIds: Record<UserId, boolean> = {};

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
    private readonly sendgridService: SendgridService,
  ) {}

  activateUser(id: UserId) {
    this.activeUserIds[id] = true;
  }

  deactivateUser(id: UserId) {
    delete this.activeUserIds[id];
  }

  async sendNotification(
    notification: Partial<Notification>,
    to: FindConditions<User>,
  ) {
    const users = await this.usersService.find(to);
    if (!users?.length) {
      return;
    }
    let loggedUsers: User[] = [];
    if (users?.length) {
      loggedUsers = users.filter(u => u.id in this.activeUserIds);
    }
    if (!('type' in notification)) {
      notification.type = NotificationType.INFO;
    }
    if (!('persistent' in notification)) {
      notification.persistent = true;
    }
    if (!('priority' in notification)) {
      notification.priority = NotificationPriority.INFO;
    }
    this.notificationsGateway.server
      ?.in(loggedUsers.map(u => u.id.toString()))
      .emit('notification', notification);
    notification.deliveredTo = users;
    if (notification.priority === NotificationPriority.CRITICAL) {
      users?.forEach(u => {
        this.sendgridService.send({
          from: 'basilthestore@gmail.com',
          to: u.email,
          subject: `New ${notification.type} notification from Basil`,
          text: notification.title + '\n\n' + notification.message,
        });
      });
    }
    if (notification.persistent) {
      await this.notificationsRepository.save(notification);
    }
  }
}
