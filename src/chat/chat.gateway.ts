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
import { Socket } from 'socket.io';
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

  handleConnection(client: Socket) {
    client.on('disconnecting', async (reason) => {
      const user = this.socketToUser[client.id];
      if (!user) return;
      console.log('disconnected', user, client.id);

      const userFromDb: any = await this.usersService.getUser(user.email);

      const groups = userFromDb.groups.reduce(
        (total, curr: any) => [...total, String(curr._id)],
        [],
      );

      groups.map(async (g) => {
        this.roomJoined[g] = this.roomJoined[g].filter(function (e) {
          return e.clientId !== client.id;
        });
        this.server
          .to(g)
          .emit('usersOnline', { groupId: g, usersOnline: this.roomJoined[g] });
      });
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('peer') peer: any,
    @Req() req: Request,
  ) {
    // if (!peer) return;
    console.log('peer', peer);
    this.socketToUser[client.id] = req.user;
    console.log('connected', client.id, req.user.name);
    this.chatService.identify(req.user.name, client.id);

    const userFromDb: any = await this.usersService.getUser(req.user.email);
    const groups = userFromDb.groups.reduce(
      (total, curr: any) => [...total, String(curr._id)],
      [],
    );

    client.join(groups);
    console.log(groups);

    const callStatusForUser = {};

    groups.map(async (g) => {
      if (!this.roomJoined[g]) this.roomJoined[g] = [];
      this.roomJoined[g].push({
        ...req.user,
        _id: userFromDb._id,
        clientId: client.id,
        peerId: peer,
      });
      this.server
        .to(g)
        .emit(
          'usersOnline',
          { groupId: g, usersOnline: this.roomJoined[g] },
          (res) => {
            console.log('sent online users');
          },
        );
      callStatusForUser[g] = this.callStatus[g];
      client.emit('callStatus', this.callStatus);
    });

    return { callStatus: callStatusForUser };
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
  roomJoined = {};
  socketToUser = {};
  callStatus = [];

  @SubscribeMessage('sending signal')
  async sendingSignal(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload,
  ) {
    console.log(
      'sending signal to ',
      payload.userToSignal,
      'from',
      payload.callerID,
    );
    this.server.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
      groupId: payload.groupId,
    });
  }

  @SubscribeMessage('returning signal')
  async returningSignal(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload,
  ) {
    console.log('returning signal to', payload.callerID);

    this.server.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  }

  @SubscribeMessage('acceptCall')
  async acceptCall(
    @ConnectedSocket() socket: Socket,
    @Req() req: Request,
    @MessageBody('groupId') groupId,
  ) {
    console.log('acceptCall', req.user.name);
    this.callStatus.push({ ...req.user, clientId: socket.id });
    this.server.to(groupId).emit('callStatus', this.callStatus);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('startCall')
  async startCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody('groupId') groupId,
    @Req() req: Request,
  ) {
    console.log('startCall', groupId, req.user.name);
    this.callStatus = [{ ...req.user, clientId: socket.id }];
    this.server.to(groupId).emit('callStatus', this.callStatus);
  }

  @SubscribeMessage('clearCall')
  async clearCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody('groupId') groupId,
  ) {
    this.callStatus = [];
    console.log('call cleared');
  }

  @SubscribeMessage('endCall')
  async endCall(@ConnectedSocket() socket: Socket, @MessageBody() payload) {
    const user = this.socketToUser[socket.id];
    console.log('call ended by', user);
  }
}
