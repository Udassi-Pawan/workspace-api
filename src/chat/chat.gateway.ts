import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
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

      groups?.map(async (g) => {
        this.roomJoined[g] = this.roomJoined[g]?.filter(function (e) {
          return e.clientId !== client.id;
        });
        this.server
          .to(g)
          .emit(`usersOnline${String(g)}`, { usersOnline: this.roomJoined[g] });
      });
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('usersOnline')
  async usersOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody('groupId') groupId: string,
  ) {
    console.log('request for users online ', groupId, {
      usersOnline: this.roomJoined[groupId],
    });
    return { usersOnline: this.roomJoined[groupId] };
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('join')
  async joinRoom(@ConnectedSocket() client: Socket, @Req() req: Request) {
    this.socketToUser[client.id] = req.user;
    console.log('connected', client.id, req.user.name);

    const userFromDb: any = await this.usersService.getUser(req.user.email);
    const groups = userFromDb.groups.reduce(
      (total, curr: any) => [...total, String(curr)],
      [],
    );

    client.join(groups);

    const callStatusForUser = {};

    groups.map(async (g) => {
      if (!this.roomJoined[g]) this.roomJoined[g] = [];
      this.roomJoined[g].push({
        ...req.user,
        _id: userFromDb._id,
        clientId: client.id,
      });
      this.server
        .to(g)
        .emit(
          `usersOnline${String(g)}`,
          { usersOnline: this.roomJoined[g] },
          (res) => {
            console.log(`sent online users with event usersOnline${String(g)}`);
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
    @MessageBody('text') text: string,
    @MessageBody('groupId') groupId: string,
    @Req() req: Request,
  ) {
    console.log('received ', text, groupId, req.user.name);
    const userFromDb = await this.usersService.getUser(req.user.email);
    const message = await this.chatService.create({
      sender: userFromDb._id,
      senderName: userFromDb.name,
      text,
      groupId,
    });

    this.server.to(groupId).emit('message', message);
    this.server.to(groupId).emit(`message ${groupId}`, message);
    return message;
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  /// video call
  roomJoined = {};
  socketToUser = {};
  callStatus = [];

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
