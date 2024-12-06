import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthResolver, AuthService, JwtService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
