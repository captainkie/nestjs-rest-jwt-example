import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

export const mongooseConfig: MongooseModule = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<MongooseModule> => {
    return {
      uri: configService.get<string>('MONGODB_URI'),
    };
  },
};
