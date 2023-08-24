import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { AuthGuard } from '@nestjs/passport';
import { Req, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/strategy/ws.gaurd';

type Request = {
  user: any;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(WsGuard)
  @SubscribeMessage('createChat')
  async create(@MessageBody() createChatDto: CreateChatDto) {
    console.log('received ', createChatDto);
    const message = await this.chatService.create(createChatDto);
    this.server.emit('messsage', message, (res) => {
      // console.log(res);
    });
    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('join')
  joinRoom(@ConnectedSocket() client: Socket, @Req() req: Request) {
    this.chatService.identify(req.user.name, client.id);
    return req.user.name;
  }

  // @SubscribeMessage('typing')
  // async typing(
  //   @MessageBody('isTyping') isTyping: boolean,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const name = this.chatService.getClientName(client.id);
  //   console.log(name, client.id, 'is typing');
  //   console.log(this.chatService.clientToUser);
  //   client.broadcast.emit('typing', { name, isTyping });
  // }
}
