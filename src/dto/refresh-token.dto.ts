import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  constructor(refreshToken?: string) {
    this.refreshToken = refreshToken ?? '';
  }
}
