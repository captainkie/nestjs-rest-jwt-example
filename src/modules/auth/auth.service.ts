import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.username,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto): Promise<any> {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    if (!user.status) throw new BadRequestException('User not active');

    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<any> {
    this.usersService.update(userId, { refreshToken: null });
    return { message: 'Logout successful' };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string): Promise<any> {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<any> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });

    return { message: 'Refresh token updated' };
  }

  async getTokens(userId: string, username: string): Promise<any> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '90d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
