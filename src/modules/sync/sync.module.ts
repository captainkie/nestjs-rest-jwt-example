import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { BrandsModule } from '@/modules/brands/brands.module';
import { syncSftpProcessor } from './sync.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sftp-queue',
    }),
    BrandsModule,
  ],
  controllers: [SyncController],
  providers: [SyncService, syncSftpProcessor],
})
export class SyncModule {}
