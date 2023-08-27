import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/schemas/users/users.service';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Injectable({})
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async login(tokenId: string) {
    console.log('request');
    const ticket = await client.verifyIdToken({
      idToken: tokenId.slice(7),
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();
    const authToken = this.jwt.sign(
      { email, name },
      { expiresIn: '60 days', secret: this.config.get('secret') },
    );
    const curUserFromDb = await this.usersService.getUser(email);
    console.log(curUserFromDb);
    if (!curUserFromDb) {
      await this.usersService.createUser(email, name);
    }
    return { authToken };
  }
}
