import jwtDecode from 'jwt-decode';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UsersService } from '../users/users.service';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
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
    client.join(user.id.toString());
    this.notificationsService.activateUser(user.id);
  }

  handleDisconnect(client: Socket) {
    try {
      const payload: any = jwtDecode(client.handshake.query.token as string);
      client.leave(payload.sub.toString());
      this.notificationsService.deactivateUser(payload.sub);
    } catch (e) {
      // noop
    }
  }
}
