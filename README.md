# nest-auth-kit

Authorization module for NestJS with JWT 2.0 (access/refresh) support, stateless refresh tokens, and best practices.

## Features
- Stateless refresh tokens (no database storage required)
- UserService abstraction for maximum flexibility
- Easy integration with any NestJS project
- Uses @nestjs/jwt and passport-jwt under the hood
- **Optional ready-to-use AuthController** for quick start

## Installation
```
npm install nest-auth-kit
```

## Quick Start

### 1. Implement your UserService
```ts
// user.service.ts
import { Injectable } from '@nestjs/common';
import { IUserService } from 'nest-auth-kit';

@Injectable()
export class UserService implements IUserService<any> {
  async validateUser({ email, username, password }: { email?: string; username?: string; password: string }) {
    // Your logic to validate user credentials
    return { id: 1, email: 'user@example.com' };
  }
  async findById(id: string | number) {
    // Your logic to find user by id
    return { id, email: 'user@example.com' };
  }
  async findByPayload(payload: any) {
    // Your logic to find user by JWT payload
    return { id: payload.sub, email: payload.email };
  }
}
```

### 2. Register AuthModule in your AppModule
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule, JwtModuleOptions, AuthController } from 'nest-auth-kit';
import { UserService } from './user.service';

const jwtOptions: JwtModuleOptions = {
  accessTokenSecret: 'ACCESS_SECRET',
  accessTokenExpiresIn: '15m',
  refreshTokenSecret: 'REFRESH_SECRET',
  refreshTokenExpiresIn: '7d',
};

@Module({
  imports: [
    AuthModule.forRoot(jwtOptions, { provide: 'UserService', useClass: UserService }),
  ],
  providers: [UserService],
  controllers: [AuthController], // <-- Import ready-to-use AuthController
})
export class AppModule {}
```

### 3. Use the ready AuthController or your own

#### Endpoints provided by AuthController:
- `POST /auth/login` — login with email/username and password, returns access & refresh tokens
- `POST /auth/refresh` — get new access token using refresh token
- `POST /auth/me` — get current user info (requires access token)

You can also implement your own controller using guards and JwtService from the package.

## DTOs Example
```ts
// login.dto.ts
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

// refresh-token.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;

  constructor(refreshToken?: string) {
    this.refreshToken = refreshToken ?? '';
  }
}
```

## API Overview
- `AuthModule.forRoot(options, userServiceProvider)` — register the module
- `JwtService` — generate/validate access and refresh tokens
- `JwtAuthGuard` — protect routes with access token
- `RefreshTokenGuard` — protect refresh endpoint
- `IUserService` — implement your own user logic
- `AuthController` — optional ready-to-use controller for login/refresh/me
