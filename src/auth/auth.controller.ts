import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

interface Request {
  user: any;
  headers: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  signin(@Req() req: Request) {
    return this.authService.login(req.headers.authorization);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('access')
  // getData(@Req() req: Request) {
  //   // console.log(req.user);
  //   return req.user;
  // }

  // @Get('test')
  // Test() {
  //   return 'workgin';
  // }
}
