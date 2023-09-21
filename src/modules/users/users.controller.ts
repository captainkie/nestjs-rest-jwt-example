import {
  ClassSerializerInterceptor,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiParam,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filters-user.dto';
import { AccessTokenGuard } from '@guards/accessToken.guard';
import { Response } from '@helpers/utils.helper';
import { ApiFilterQuery } from '@decorators/api-filter-query.decorator';
import { ApiInternalServerErrorResponse } from '@decorators/api-response.decorator';
import { User, UserDocument } from './schemas/user.schema';
// import { MongooseClassSerializerInterceptor } from '@helpers/mongooseClassSerializer.interceptor';

@Controller('users')
// @UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
@ApiTags('2 - Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ schema: Response.unauthorizedSchema() })
@ApiInternalServerErrorResponse()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: <string>'string',
        refreshToken: <string>'string',
      },
    },
  })
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiFilterQuery('filters', FilterUserDto)
  @ApiOkResponse({ type: UpdateUserDto, isArray: true })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('filters') filters: FilterUserDto,
  ): Promise<UserDocument[]> {
    const paginateOptions: any = {
      limit: limit > 10 ? 10 : limit,
      page,
    };

    return await this.usersService.findAll(paginateOptions, filters);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiOkResponse({ type: UpdateUserDto })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async findById(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  @ApiOkResponse({ type: UpdateUserDto })
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', example: 'asdf1234jkl' })
  @ApiOkResponse()
  @ApiUnprocessableEntityResponse({
    schema: Response.unprocessableEntity(),
  })
  async remove(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.remove(id);
  }
}
