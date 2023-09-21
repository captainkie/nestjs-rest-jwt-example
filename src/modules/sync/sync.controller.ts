import {
  Controller,
  Param,
  Post,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import { AccessTokenGuard } from '@guards/accessToken.guard';
import { Response } from '@helpers/utils.helper';
import { SyncService } from './sync.service';
import { ApiInternalServerErrorResponse } from '@decorators/api-response.decorator';
import { BrandsService } from '../brands/brands.service';

@Controller('sync')
@ApiTags('9 - Sync Data to Dfinery')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ schema: Response.unauthorizedSchema() })
@ApiInternalServerErrorResponse()
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly brandsService: BrandsService,
    @InjectQueue('sftp-queue') private readonly sftpQueue: Queue,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('queue/:brand')
  @ApiParam({ name: 'brand', example: 'brand' })
  @ApiOkResponse()
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async queue(@Param('brand') brand: string): Promise<any> {
    const brandId = await this.brandsService.findBySlug(brand, true);
    const brandSlug = brand;
    if (!brandId) {
      throw new NotFoundException('Brand not found or inactive');
    } else {
      return await this.syncService
        .prepareSyncCsv(brandId?._id.toString(), brandSlug)
        .then(
          async (fileName: []) =>
            await this.syncService
              .provideSyncCsv(fileName)
              .then(async (response: []) => {
                if (response.length === 0) {
                  throw new NotFoundException('No data to sync');
                } else {
                  // send to bull queue
                  const setBullQueue = async (queues: any) => {
                    let requestQueue = [];
                    requestQueue = await Promise.all(
                      queues.map(async (file: any) => {
                        return await this.sftpQueue.add('sync-job', file[0]);
                      }),
                    );

                    return requestQueue;
                  };

                  const addQueue = await setBullQueue(response);

                  return Promise.resolve(addQueue);
                }
              }),
        );
    }
  }
}
