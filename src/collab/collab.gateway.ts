import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from '@hocuspocus/server';
import { Req } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollabGateway {
  @WebSocketServer()
  server: any;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  @SubscribeMessage('/collaboration/:document')
  handleDoc(client: any, @Req() req: any) {
    const server = Server.configure({
      name: '127.0.0.1',
      port: 3333,
      timeout: 30000,
      debounce: 5000,
      maxDebounce: 30000,
      quiet: true,
    });
    const context = {
      user: {
        id: 1234,
        name: 'Jane',
      },
    };

    server.handleConnection(server, req, context);
  }
}
