import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must be a string.' })
  fullname: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Confirm password is required.' })
  confirmPassword: string;
}
