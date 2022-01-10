import jwtDecode from 'jwt-decode';
import { forwardRef, Inject } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsersService } from '../users/users.service';
import { NotificationsService } from './services/notifications.service';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: any;

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: any) {
    let payload: any;
    try {
      payload = jwtDecode(client.handshake.query.token as string);
    } catch (e) {}
    if (!payload) {
      client.disconnect();
      return;
    }
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      client.disconnect();
    }
    client.join(user?.id.toString());
    this.notificationsService.activateUser(user.id);
  }

  handleDisconnect(client: any) {
    try {
      const payload: any = jwtDecode(client.handshake.query.token as string);
      client.leave(payload.sub.toString());
      this.notificationsService.deactivateUser(payload.sub);
    } catch (e) {
      // noop
    }
  }
}
