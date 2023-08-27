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
import { UsersService } from 'src/schemas/users/users.service';

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
  server: any;
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(WsGuard)
  @SubscribeMessage('join')
  async joinRoom(@ConnectedSocket() client: Socket, @Req() req: Request) {
    this.chatService.identify(req.user.name, client.id);

    const userFromDb: any = await this.usersService.getUser(req.user.email);

    const groups = userFromDb.groups.reduce(
      (total, curr: any) => [...total, String(curr._id)],
      [],
    );
    console.log(groups);

    client.join(groups);
    return req.user.name;
  }
  @UseGuards(WsGuard)
  @SubscribeMessage('createChat')
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChatDto: CreateChatDto,
    @Req() req: Request,
  ) {
    console.log('received ', createChatDto);
    const message = await this.chatService.create({
      name: req.user.name,
      ...createChatDto,
    });

    // client.in('abcd').emit('message', message, () => {
    //   console.log('sent', message);
    // });
    this.server.to(createChatDto.groupId).emit('messsage', message, (res) => {
      console.log('sent to abcd', res);
    });
    // this.server.emit('messsage', message, (res) => {
    //   // console.log(res);
    // });
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
