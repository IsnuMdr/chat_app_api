// create-chatroom.dto.ts

import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChatroomDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [String])
  @IsArray()
  userIds: string[];
}
