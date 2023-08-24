import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/schemas/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private config: ConfigService, // private userService: UsersService,
    private jwt: JwtService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.jwt.verify(bearerToken, {
        publicKey: 'supersecret',
      }) as any;
      context.switchToHttp().getRequest().user = decoded;
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
