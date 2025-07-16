import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Inject,
  UnauthorizedException,
  Optional,
  Request,
} from '@nestjs/common';
import { JwtService } from '../services/jwt.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { IUserService } from '../interfaces/user-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserService') private readonly userService: IUserService<any>,
    @Optional() @Inject('BCRYPT_SALT_ROUNDS') private readonly saltRounds: number = 10,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.validateUser(dto);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, username: user.username, roles: user.roles };
    return {
      accessToken: await this.jwtService.generateAccessToken(payload),
      refreshToken: await this.jwtService.generateRefreshToken(payload),
      user,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Body() dto: RefreshTokenDto) {
    const payload = await this.jwtService.validateRefreshToken(dto.refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token');
    return {
      accessToken: await this.jwtService.generateAccessToken(payload),
    };
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    return req.user;
  }
}
