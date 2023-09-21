import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(5)
  @MaxLength(30)
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password in plain text',
    example: 'Password@123!!!',
  })
  @Length(8, 24)
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Password should have 1 uppercase, lowercase letter along with a number and special character.',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsEmpty()
  avatar?: string;

  @IsEmpty()
  status?: boolean;

  @IsEmpty()
  role?: string;

  @IsEmpty()
  refreshToken?: string;
}
