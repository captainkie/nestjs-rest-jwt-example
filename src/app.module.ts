import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { SftpModule } from 'nest-sftp';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@/config/app.config';
import { mongooseConfig } from '@/config/mongoose.config';
import { bullConfig } from '@/config/bull.config';
import { sftpConfig } from '@/config/sftp.config';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { BrandsModule } from './modules/brands/brands.module';
import { SyncModule } from './modules/sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync(mongooseConfig),
    BullModule.forRootAsync(bullConfig),
    SftpModule.forRootAsync(sftpConfig, false),
    AuthModule,
    UsersModule,
    BrandsModule,
    SyncModule,
  ],
})
export class AppModule {}
