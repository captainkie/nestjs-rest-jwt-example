import { Injectable, NotFoundException } from '@nestjs/common';
import { AsyncParser } from '@json2csv/node';
import {
  createFile,
  checkIfFileOrDirectoryExists,
} from '@helpers/storage.helper';
import { ConfigService } from '@nestjs/config';
import { BrandsService } from '@/modules/brands/brands.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly configService: ConfigService,
  ) {}

  async prepareSyncCsv(id: string, brand: string): Promise<any> {
    // get brand data
    const brandData = await this.brandsService.findById(id);
    // loop through all the brands
    const createCsvFiles = async (socials: any) => {
      let fileNames = [];
      fileNames = await Promise.all(
        socials.map(async (social: any) => {
          // get messages
          const getMsg = ['msg1', 'msg2'];

          if (getMsg.length > 0) {
            // set mapping fields
            const current = new Date();
            const subFolderDate: string = current.toISOString().slice(0, 10);
            const opts = {
              includeEmptyRows: false,
              withBOM: false,
            };

            const parser = new AsyncParser(opts);
            const csv = await parser.parse(getMsg).promise();

            if (!csv) {
              return [];
            }

            const filePath = `storage/exports/${social}`;
            const fileName = `export-${this.configService.get<string>(
              'app.SFTP_SYNC_VERSION',
            )}-${brand}-${new Date().toISOString()}.csv`;

            // create csv file
            await createFile(filePath, fileName, csv);

            return [
              {
                provider: social,
                brandID: id,
                brandSlug: brand,
                filePath: filePath,
                fileName: fileName,
              },
            ];
          } else {
            return [];
          }
        }),
      );

      return fileNames;
    };

    const createdQueue = await createCsvFiles(brandData.socials);

    return Promise.resolve(createdQueue);
  }

  async provideSyncCsv(filename: []): Promise<any> {
    const getCsvFiles = async (files: any) => {
      let fileNames = [];
      fileNames = await Promise.all(
        files.map(async (file: any) => {
          if (file.length > 0) {
            const filePath = `${file[0].filePath}/${file[0].fileName}`;
            if (!checkIfFileOrDirectoryExists(filePath)) {
              throw new NotFoundException('Data export not found.');
            }

            return [
              {
                provider: file[0].provider,
                brandID: file[0].brandID,
                brandSlug: file[0].brandSlug,
                filePath: file[0].filePath,
                fileName: file[0].fileName,
                file: filePath,
              },
            ];
          }
        }),
      );

      return fileNames;
    };

    const setQueue = await getCsvFiles(
      filename.filter((file: any) => file.length > 0),
    );

    return Promise.resolve(setQueue);
  }
}
