import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { config } from 'dotenv';

config();

export const bullConfig: BullModule = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<BullModule> => {
    return {
      redis: {
        host: configService.get<string>('BULL_REDIS_URI'),
        port: configService.get<number>('BULL_REDIS_PORT'),
      },
    };
  },
};
