import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UserService } from './user.service';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { User } from './user.type';
import { GraphqlAuthGuard } from 'src/auth/graphql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => User)
  async updateProfile(
    @Args('fullname') fullname: string,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
    @Context() context: { req: Request },
  ) {
    const imageUrl = file ? await this.storeImageAndGetUrl(file) : null;
    const userId = context.req.user.sub;
    return this.userService.updateProfile(userId, fullname, imageUrl);
  }

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;

    const uniqueFileName = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', 'images', uniqueFileName);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFileName}`;
    const readStream = createReadStream();

    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [User])
  async searchUsers(
    @Args('fullname') fullname: string,
    @Context() context: { req: Request },
  ) {
    return this.userService.searchUsers(fullname, context.req.user.sub);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [User])
  getUsersOfChatroom(@Args('chatroomId') chatroomId: number) {
    return this.userService.getUsersOfChatroom(chatroomId);
  }
}
