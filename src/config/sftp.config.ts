import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { config } from 'dotenv';

config();

export const sftpConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      host: configService.get<string>('app.SFTP_HOST'),
      port: configService.get<number>('app.SFTP_PORT'),
      username: configService.get<string>('app.SFTP_USERNAME'),
      privateKey: fs.readFileSync(
        configService.get<string>('app.SFTP_PRIVATEKEY'),
      ),
      passphrase: configService.get<string>('app.SFTP_PASSPHRASE'),
      debug: false,
    };
  },
  inject: [ConfigService],
  imports: [ConfigModule],
};
