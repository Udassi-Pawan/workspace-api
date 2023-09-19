import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/schemas/users/users.module';
import { GroupsModule } from 'src/schemas/groups/groups.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [JwtModule, UsersModule, GroupsModule, S3Module],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
