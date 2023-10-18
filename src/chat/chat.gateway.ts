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
import { GroupsService } from 'src/schemas/groups/groups.service';

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
    private readonly groupsService: GroupsService,
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
        this.callStatus[g] = this.callStatus[g]?.filter(function (e) {
          return e.clientId !== client.id;
        });
        this.server.to(g).emit(`usersOnline${String(g)}`, {
          usersOnline: this.roomJoined[g],
          callStatus: this.callStatus[g],
        });
      });
    });
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('usersOnline')
  async usersOnline(@MessageBody('groupId') groupId: string) {
    return {
      usersOnline: this.roomJoined[groupId],
      callStatus: this.callStatus[groupId],
    };
  }

  @SubscribeMessage('whoOnline')
  async whoIsOnline() {
    return this.socketToUser;
  }

  @SubscribeMessage('joinSocket')
  async joinRoom(@ConnectedSocket() client) {
    console.log('joined client', client.id);
    this.socketToUser.push(client.id);
    return client.id;
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('createChat')
  async create(
    @MessageBody('image') image: string,
    @MessageBody('text') text: string,
    @MessageBody('groupId') groupId: string,
    @ConnectedSocket() socket: Socket,
    @MessageBody('video') video: string,
    @Req() req: Request,
  ) {
    console.log('received ', text, groupId, req.user.name);
    const userFromDb = await this.usersService.getUser(req.user.email);
    if (userFromDb.groups.find((g) => String(g) == groupId)) {
      const message = await this.chatService.create({
        sender: userFromDb._id,
        senderName: userFromDb.name,
        text,
        groupId,
        image,
        video,
      });

      socket.broadcast.to(groupId).emit('message', message);
      this.server.to(groupId).emit(`message ${groupId}`, message);
      return message;
    } else return 'user not member of group';
  }

  roomJoined = {};
  socketToUser = [];
  callStatus = {};

  /////////////////////////// video

  @UseGuards(WsGuard)
  @SubscribeMessage('startCall')
  async startCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody('groupId') groupId,
    @Req() req: Request,
  ) {
    console.log('startCall', groupId, req.user.name);
    this.callStatus[groupId] = [{ ...req.user, clientId: socket.id }];
    this.server
      .to(groupId)
      .emit(`callStatus${groupId}`, this.callStatus[groupId]);
  }

  @SubscribeMessage('acceptCall')
  async acceptCall(
    @ConnectedSocket() socket: Socket,
    @Req() req: Request,
    @MessageBody('groupId') groupId,
  ) {
    console.log('acceptCall', req.user.name);
    this.callStatus[groupId].push({ ...req.user, clientId: socket.id });
    this.server
      .to(groupId)
      .emit(`callStatus${groupId}`, this.callStatus[groupId]);
  }

  @SubscribeMessage('clearCall')
  async clearCall(
    @ConnectedSocket() socket: Socket,
    @MessageBody('groupId') groupId,
  ) {
    this.callStatus[groupId] = [];
    console.log('call cleared');
  }

  @SubscribeMessage('endCall')
  async endCall(
    @ConnectedSocket() client: Socket,
    @MessageBody('groupId') groupId,
  ) {
    this.callStatus[groupId] = this.callStatus[groupId]?.filter(function (e) {
      return e.clientId !== client.id;
    });
    console.log('end ', client.id, 'groupId', groupId);
    this.server
      .to(groupId)
      .emit(`callStatus${groupId}`, this.callStatus[groupId]);
  }

  ///////////////////////// whiteboard

  @SubscribeMessage('client-ready')
  async clientReady(
    @MessageBody('groupId') groupId,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('client ready', groupId);
    socket.broadcast.to(groupId).emit('get-canvas-state');
  }

  @SubscribeMessage('canvas-state')
  async canvasState(
    @MessageBody('groupId') groupId,
    @MessageBody('state') state,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('received canvas state');
    setTimeout(() => {
      this.server.to(groupId).emit('canvas-state-from-server', state);
    }, 1000);
  }

  @SubscribeMessage('draw-line')
  async drawLine(
    @MessageBody('groupId') groupId,
    @MessageBody('prevPoint') prevPoint,
    @MessageBody('currentPoint') currentPoint,
    @MessageBody('color') color,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast
      .to(groupId)
      .emit('draw-line', { prevPoint, currentPoint, color });
  }

  @SubscribeMessage('clear')
  async clear(@MessageBody('groupId') groupId) {
    this.server.to(groupId).emit('clear');
  }
}
