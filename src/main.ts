import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'apollo-require-preflight',
      'X-Requested-With',
    ],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const formatedErrors = errors.reduce((accumulator, error) => {
          accumulator[error.property] = Object.values(error.constraints).join(
            ', ',
          );
          return accumulator;
        }, {});

        throw new BadRequestException(formatedErrors);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
