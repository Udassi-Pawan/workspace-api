import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signin(@Req() req: Request) {
    console.log();
    return this.authService.login(req.headers.authorization);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('access')
  getData() {
    return 'user-data';
  }
}
