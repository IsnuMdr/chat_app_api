import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { TokenService } from './token/token.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ChatroomService } from './chatroom/chatroom.service';
import { ChatroomResolver } from './chatroom/chatroom.resolver';
import { ChatroomModule } from './chatroom/chatroom.module';
import { JwtService } from '@nestjs/jwt';
import { LiveChatroomModule } from './live-chatroom/live-chatroom.module';

// const pubSub = new RedisPubSub({
//   connection: {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379', 10),
//     retryStrategy: (times) => Math.min(times * 50, 2000),
//   },
// });

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        tokenService: TokenService,
      ) => {
        return {
          installSubscriptionHandlers: true,
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': true,
          },
          onConnect: (connectionParams) => {
            const token = tokenService.extractToken(connectionParams);
            const user = tokenService.validateToken(token);

            if (!token) {
              throw new Error('Token not provided');
            }

            if (!user) {
              throw new Error('Token invalid');
            }
            return { user };
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, user: connection.context.user }; // Injecting pubSub into context
            }
            return { req, res };
          },
        };
      },
    }),
    PrismaModule,
    ChatroomModule,
    LiveChatroomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TokenService,
    ChatroomService,
    ChatroomResolver,
    JwtService,
  ],
})
export class AppModule {}
