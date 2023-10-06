import { Controller, Get, Post, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

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

  @Get('test')
  test() {
    return 'Working';
  }
}
