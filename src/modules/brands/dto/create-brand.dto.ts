import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  sftp_domain: string;

  @ApiProperty()
  @IsNotEmpty()
  sftp_path: string;

  @ApiProperty()
  @IsNotEmpty()
  sftp_username: string;

  @ApiProperty()
  @IsNotEmpty()
  ssh_keypem: string;

  @ApiProperty()
  @IsNotEmpty()
  unique_key: string;

  @ApiProperty()
  @IsNotEmpty()
  table_type: string;

  @ApiProperty()
  socials?: string[];

  @ApiProperty()
  @IsNotEmpty()
  status?: boolean;
}
