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

    this.server.to(createChatDto.groupId).emit('messsage', message, (res) => {
      console.log('sent to abcd', res);
    });
    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }

  /// video call

  users = {};

  socketToRoom = {};

  @SubscribeMessage('join room')
  async joinVideoRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomID,
  ) {
    console.log('received ', roomID);
    if (this.users[roomID]) {
      const length = this.users[roomID].length;
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      this.users[roomID].push(socket.id);
    } else {
      this.users[roomID] = [socket.id];
    }
    this.socketToRoom[socket.id] = roomID;
    const usersInThisRoom = this.users[roomID].filter((id) => id !== socket.id);

    socket.emit('all users', usersInThisRoom);
  }

  @SubscribeMessage('sending signal')
  async sendingSignal(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload,
  ) {
    this.server.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  }

  @SubscribeMessage('returning signal')
  async returningSignal(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload,
  ) {
    this.server.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  }

  @SubscribeMessage('disconnect')
  async disconnect(@ConnectedSocket() socket: Socket, @MessageBody() payload) {
    const roomID = this.socketToRoom[socket.id];
    let room = this.users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      this.users[roomID] = room;
    }
  }
}
