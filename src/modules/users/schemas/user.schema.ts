import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
// import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // @Transform(({ value }) => value.toString())
  // _id: ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  // @Exclude()
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, default: false })
  status: boolean;

  @Prop({ required: false })
  avatar: string;

  @Prop({ required: true, default: 'guest' })
  role: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
