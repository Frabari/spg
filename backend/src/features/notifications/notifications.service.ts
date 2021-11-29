import { FindManyOptions, Repository } from 'typeorm';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserId } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private activeUserIds: Record<UserId, boolean> = {};

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  activateUser(id: UserId) {
    this.activeUserIds[id] = true;
  }

  deactivateUser(id: UserId) {
    delete this.activeUserIds[id];
  }

  async sendNotification(
    notification: Notification,
    to: FindManyOptions<User>,
  ) {
    const users = await this.usersService.find(to);
    let loggedUsers: User[] = [];
    if (users?.length) {
      loggedUsers = users.filter(u => u.id in this.activeUserIds);
    }
    this.notificationsGateway.server
      .in(loggedUsers.map(u => u.id.toString()))
      .emit('notification', notification);
    notification.deliveredTo = users;
    await this.notificationsRepository.save(notification);
  }
}
