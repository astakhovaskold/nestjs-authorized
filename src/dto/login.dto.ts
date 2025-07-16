import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  constructor(partial?: Partial<LoginDto>) {
    if (partial) {
      this.email = partial.email;
      this.username = partial.username;
      this.password = partial.password ?? '';
    } else {
      this.password = '';
    }
  }
}
