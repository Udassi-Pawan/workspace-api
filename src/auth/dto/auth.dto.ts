import { Request } from '@nestjs/common';

export interface AuthDto {
  email: string;
  password: string;
}

declare global {
    interface Headers {
      authorization: string;
    }
}
