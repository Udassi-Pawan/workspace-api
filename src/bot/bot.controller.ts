import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BotService } from './bot.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/schemas/users/users.service';
import { GroupsService } from 'src/schemas/groups/groups.service';

class Request {
  user: any;
  body: any;
  query: any;
}

@Controller('bot')
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    private jwt: JwtService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async create(@Req() req: Request) {
    const bearerToken = String(
      req.body.originalDetectIntentRequest.payload.userId,
    );
    const user = this.jwt.verify(bearerToken, {
      publicKey: 'supersecret',
    }) as any;
    const intent = req.body.queryResult.intent.displayName;
    if (intent == 'join group') {
      const groupName = req.body.queryResult.parameters['group-name'];
      console.log('join group', groupName);
      const userFromDb = await this.usersService.getUser(user.email);
      const groupFromDb = await this.groupsService.getGroupByName(groupName);
      await this.groupsService.joinGroup(userFromDb._id, groupFromDb._id);
      await this.usersService.updateUser(
        { _id: userFromDb._id },
        {
          $push: { groups: groupFromDb._id },
        },
      );
      return {
        fulfillmentText: `Successfully joined group  ${groupName}, Reload now to see changes.`,
      };
    } else if (intent == 'leave group') {
      const groupName = req.body.queryResult.parameters['group-name'];
      console.log('leave group', groupName);
      const userFromDb = await this.usersService.getUser(user.email);
      const groupFromDb = await this.groupsService.getGroupByName(groupName);
      await this.groupsService.leaveGroup(userFromDb._id, groupFromDb._id);
      await this.usersService.updateUser(
        { _id: userFromDb._id },
        {
          $pull: { groups: groupFromDb._id },
        },
      );
      return {
        fulfillmentText: `Successfully left group  ${groupName}, Reload now to see changes.`,
      };
    }
    return {
      fulfillmentText: 'received',
    };
  }
}
