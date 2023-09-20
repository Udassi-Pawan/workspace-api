import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { JwtModule } from '@nestjs/jwt';
import { GroupsModule } from 'src/schemas/groups/groups.module';
import { UsersModule } from 'src/schemas/users/users.module';

@Module({
  imports: [JwtModule, GroupsModule, UsersModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
