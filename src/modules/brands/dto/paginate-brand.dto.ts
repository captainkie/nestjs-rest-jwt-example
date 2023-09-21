import { IsNumber, IsMongoId, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateBrandDto {
  @IsOptional()
  @IsMongoId()
  startId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
