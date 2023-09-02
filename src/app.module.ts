import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './schemas/users/users.module';
import { GroupsModule } from './schemas/groups/groups.module';
import { CollabModule } from './collab/collab.module';
import { CollabGateway } from './collab/collab.gateway';
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
    CollabModule,
  ],
  providers: [CollabGateway],
})
export class AppModule {}
