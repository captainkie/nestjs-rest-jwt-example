import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterBrandDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public name?: string;
}
