import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [AuthModule, BookmarkModule, ConfigModule.forRoot({ isGlobal :true }), ChatModule, MongooseModule.forRoot()],
})
export class AppModule {}
