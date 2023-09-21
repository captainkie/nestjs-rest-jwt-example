import { PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  status?: boolean;
}
