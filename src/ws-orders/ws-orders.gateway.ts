import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseOrderDto } from '@/orders/dto/response/response-order.dto';
import { WsOrdersService } from '@/ws-orders/ws-orders.service';

export type WsEventName = 'new' | 'update';

const ADMIN_ROOM = 'admins';

const EVENTS = {
  new: 'NEW_ORDER',
  update: 'UPDATE_ORDER',
} satisfies Record<WsEventName, string>;

@WebSocketGateway({ namespace: 'orders', transports: ['websocket'] })
export class WsOrdersGateway implements OnGatewayConnection {
  constructor(private readonly wsService: WsOrdersService) {}
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: Socket) {
    const isAdmin = this.wsService.checkAdmin(client);
    if (!isAdmin) {
      client.emit('ERROR', { message: 'No token provided' });
      client.disconnect();
      return;
    }
    await client.join(ADMIN_ROOM);
  }

  sendMessage(event: 'new' | 'update', order: ResponseOrderDto) {
    this.server.to(ADMIN_ROOM).emit(EVENTS[event], order);
  }
}
