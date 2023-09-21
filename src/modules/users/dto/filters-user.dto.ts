import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public surname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public email?: string;
}
