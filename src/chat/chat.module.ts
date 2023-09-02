import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/schemas/users/users.module';
import { GroupsModule } from 'src/schemas/groups/groups.module';

@Module({
  imports: [JwtModule, UsersModule, GroupsModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
