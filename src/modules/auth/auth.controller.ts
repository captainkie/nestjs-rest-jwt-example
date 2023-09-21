import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '@guards/accessToken.guard';
import { RefreshTokenGuard } from '@guards/refreshToken.guard';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from '@helpers/utils.helper';
import { ApiInternalServerErrorResponse } from '@decorators/api-response.decorator';

@ApiTags('1 - Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiInternalServerErrorResponse()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  async signup(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiBody({ type: AuthDto })
  @ApiCreatedResponse({
    schema: {
      example: {
        accessToken: <string>'string',
        refreshToken: <string>'string',
      },
    },
  })
  @ApiBadRequestResponse({ schema: Response.badRequest() })
  async signin(@Body() data: AuthDto): Promise<any> {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiOkResponse()
  @ApiUnauthorizedResponse({ schema: Response.unauthorizedSchema() })
  async logout(@Req() req: Request): Promise<any> {
    return this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiUnauthorizedResponse({ schema: Response.unauthorizedSchema() })
  @ApiForbiddenResponse({ schema: Response.forbidden() })
  async refreshTokens(@Req() req: Request): Promise<any> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
