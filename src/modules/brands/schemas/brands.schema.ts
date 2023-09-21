import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  sftp_domain: string;

  @Prop({ required: true })
  sftp_path: string;

  @Prop({ required: true })
  sftp_username: string;

  @Prop({ required: true })
  ssh_keypem: string;

  @Prop({ required: true })
  unique_key: string;

  @Prop({ required: true })
  table_type: string;

  @Prop({ required: false })
  socials: string[];

  @Prop({ required: true })
  status: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
