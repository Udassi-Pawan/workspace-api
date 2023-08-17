import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Injectable({})
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
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
      { expiresIn: '60min', secret: this.config.get('secret') },
    );
    return { authToken };
  }
}
