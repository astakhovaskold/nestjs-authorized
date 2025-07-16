import { Injectable, Inject, Optional } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export interface JwtModuleOptions {
  accessTokenSecret: string;
  accessTokenExpiresIn: string | number;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string | number;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    @Inject('JWT_MODULE_OPTIONS') private readonly options: JwtModuleOptions,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.options.accessTokenSecret,
      expiresIn: this.options.accessTokenExpiresIn,
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.options.refreshTokenSecret,
      expiresIn: this.options.refreshTokenExpiresIn,
    });
  }

  async validateAccessToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.options.accessTokenSecret,
      });
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.options.refreshTokenSecret,
      });
    } catch {
      return null;
    }
  }
}
