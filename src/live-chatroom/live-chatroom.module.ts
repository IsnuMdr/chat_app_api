import { Module } from '@nestjs/common';
import { LiveChatroomService } from './live-chatroom.service';
import { LiveChatroomResolver } from './live-chatroom.resolver';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    LiveChatroomResolver,
    LiveChatroomService,
    UserService,
    PrismaService,
    JwtService,
  ],
})
export class LiveChatroomModule {}
