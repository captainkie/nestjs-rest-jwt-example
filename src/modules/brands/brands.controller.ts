import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FilterBrandDto } from './dto/filters-brand.dto';
import { AccessTokenGuard } from '@guards/accessToken.guard';
import { Response } from '@helpers/utils.helper';
import { ApiFilterQuery } from '@decorators/api-filter-query.decorator';
import { ApiInternalServerErrorResponse } from '@decorators/api-response.decorator';
import { BrandDocument } from './schemas/brands.schema';

@Controller('brands')
@ApiTags('4 - Brands')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ schema: Response.unauthorizedSchema() })
@ApiInternalServerErrorResponse()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiCreatedResponse({ type: CreateBrandDto })
  @ApiOkResponse()
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  async create(@Body() createBrandDto: CreateBrandDto): Promise<BrandDocument> {
    return await this.brandsService.create(createBrandDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiFilterQuery('filters', FilterBrandDto)
  @ApiOkResponse({ type: UpdateBrandDto, isArray: true })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filters') filters: FilterBrandDto,
  ): Promise<BrandDocument[]> {
    const paginateOptions: any = {
      limit: limit > 10 ? 10 : limit,
      page,
    };

    return await this.brandsService.findAll(paginateOptions, filters);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiOkResponse({ type: UpdateBrandDto })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async findById(@Param('id') id: string): Promise<BrandDocument> {
    return await this.brandsService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  @ApiOkResponse({ type: UpdateBrandDto })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandDocument> {
    return await this.brandsService.update(id, updateBrandDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiOkResponse()
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async remove(@Param('id') id: string): Promise<BrandDocument> {
    return await this.brandsService.remove(id);
  }
}
