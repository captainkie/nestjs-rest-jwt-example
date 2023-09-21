import {
  Process,
  Processor,
  OnQueueError,
  OnQueueWaiting,
  OnQueueActive,
  OnQueueStalled,
  OnQueueProgress,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueResumed,
  OnQueueCleaned,
  OnQueueDrained,
  OnQueueRemoved,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SftpClientService } from 'nest-sftp';
import * as fs from 'fs';
import { Buffer } from 'buffer';
import {
  checkIfFileOrDirectoryExists,
  deleteFile,
} from '@helpers/storage.helper';
import { SyncService } from './sync.service';
import { BrandsService } from '@/modules/brands/brands.service';
import { ConfigService } from '@nestjs/config';

@Processor('sftp-queue')
export class syncSftpProcessor {
  private readonly logger = new Logger(syncSftpProcessor.name);
  constructor(
    private readonly sftpClient: SftpClientService,
    private readonly configService: ConfigService,
    private readonly brandsService: BrandsService,
    private readonly syncService: SyncService,
  ) {}

  @Process('social-sync-job')
  async onProcess(job: Job<any>): Promise<any> {
    // get brand data
    const brandData = await this.brandsService.findById(job.data.brandID);

    const current = new Date();
    const subFolderDate = current.toISOString().slice(0, 10).replace(/-/g, '');
    const remotePath = `${brandData.sftp_path}/${subFolderDate}`;

    // create pem file
    const pem = Buffer.from(brandData.ssh_keypem, 'base64').toString('ascii');
    const filePath = `cert/sftp`;
    const fileName = `${brandData.sftp_username}.pem`;

    try {
      fs.writeFileSync(`${filePath}/${fileName}`, pem, {
        mode: 0o400,
      });
    } catch (error) {}

    // sftp connect
    const sftpConfig = {
      host: brandData.sftp_domain,
      port: this.configService.get<number>('app.SFTP_PORT'),
      username: brandData.sftp_username,
      privateKey: fs.readFileSync(`${filePath}/${fileName}`),
      passphrase: this.configService.get<string>('app.SFTP_PASSPHRASE'),
      debug: false,
    };

    await this.sftpClient.resetConnection(sftpConfig);

    // create remote path
    const checkPath = await this.sftpClient.exists(remotePath);
    if (!checkPath) {
      await this.sftpClient.makeDirectory(remotePath, true);
    }

    const realRemotePath = await this.sftpClient.realPath(`${remotePath}`);
    const fileContent: any = fs.createReadStream(`${job.data.file}`, 'utf8');

    // upload csv file
    await this.sftpClient.upload(
      fileContent,
      `${realRemotePath}/${job.data.fileName}`,
    );

    this.logger.debug(`Sync onProcess: ${JSON.stringify(job.data)}`);
  }

  @OnQueueActive()
  onActive(job: Job<any>) {
    this.logger.debug(`Sync onActive: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  async onCompleted(job: Job<any>): Promise<any> {
    // update sync status
    const brandData = await this.brandsService.findById(job.data.brandID);
    const reader = await fs.readFileSync(job.data.file, 'utf8');
    const readerLine = reader.split(/\r?\n/);
    readerLine.forEach(async (line) => {
      const split = line.split(',');
      const _id = split[0].replace(/"/g, '');
      if (_id != brandData.unique_key) {
        await this.syncService.updateByBrand(
          job.data.provider,
          _id,
          'completed',
        );
      }
    });

    // delete file
    if (checkIfFileOrDirectoryExists(job.data.file)) {
      await deleteFile(job.data.file);
    }

    this.logger.debug(`Sync onCompleted: ${JSON.stringify(job.data)}`);
  }

  @OnQueueError()
  onError(job: Job<any>) {
    this.logger.debug(`Sync onError: ${JSON.stringify(job)}`);
  }

  @OnQueueWaiting()
  onWaiting(job: Job<any>) {
    this.logger.debug(`Sync onWaiting: ${JSON.stringify(job.data)}`);
  }

  @OnQueueStalled()
  onStalled(job: Job<any>) {
    this.logger.debug(`Sync onStalled: ${JSON.stringify(job.data)}`);
  }

  @OnQueueProgress()
  onProgress(job: Job<any>) {
    this.logger.debug(`Sync onProgress: ${JSON.stringify(job.data)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job<any>) {
    this.logger.debug(`Sync onFailed: ${JSON.stringify(job.data)}`);
  }

  @OnQueuePaused()
  onPaused(job: Job<any>) {
    this.logger.debug(`Sync onPaused: ${JSON.stringify(job.data)}`);
  }

  @OnQueueResumed()
  onResumed(job: Job<any>) {
    this.logger.debug(`Sync onResumed: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCleaned()
  onCleaned(job: Job<any>) {
    this.logger.debug(`Sync onCleaned: ${JSON.stringify(job.data)}`);
  }

  @OnQueueDrained()
  onDrained(job: Job<any>) {
    this.logger.debug(`Sync onDrained: ${JSON.stringify(job.data)}`);
  }

  @OnQueueRemoved()
  onRemoved(job: Job<any>) {
    this.logger.debug(`Sync onRemoved: ${JSON.stringify(job.data)}`);
  }
}
