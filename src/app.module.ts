import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './schemas/users/users.module';
import { GroupsModule } from './schemas/groups/groups.module';
import { DocsModule } from './schemas/docs/docs.module';
import { S3Module } from './s3/s3.module';
import { FilesModule } from './files/files.module';
import { BotModule } from './bot/bot.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    MongooseModule.forRoot(
      `mongodb+srv://pawankumarudassi:${process.env.MONGO_PASS}@cluster0.gosbfg9.mongodb.net/?retryWrites=true&w=majority`,
    ),
    UsersModule,
    GroupsModule,
    DocsModule,
    S3Module,
    FilesModule,
    BotModule,
  ],
  // providers: [CollabGateway],
})
export class AppModule {}
