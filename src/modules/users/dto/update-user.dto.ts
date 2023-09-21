import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsEmpty()
  avatar?: string;

  @IsNotEmpty()
  status?: boolean;

  @IsNotEmpty()
  role?: string;
}
