import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field(() => String)
  fullname: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field()
  email?: string;

  @Field()
  password?: string;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
