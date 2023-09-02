import { Module } from '@nestjs/common';
import { CollabService } from './collab.service';
import { CollabGateway } from './collab.gateway';
import { JwtModule } from '@nestjs/jwt';    

@Module({
  imports: [JwtModule],
  providers: [CollabGateway, CollabService],
})
export class CollabModule {}
