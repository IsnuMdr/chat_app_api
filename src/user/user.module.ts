import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserResolver, UserService, PrismaService, JwtService],
  exports: [UserService],
})
export class UserModule {}
