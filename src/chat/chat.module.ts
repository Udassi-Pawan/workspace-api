import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/schemas/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
