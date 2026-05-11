# Quick Start

## Install

```bash
npm install nestjs-authorized @nestjs/jwt @nestjs/passport passport passport-jwt
```

Your NestJS application should already include `@nestjs/common` and `@nestjs/core`.

## 1. Implement `IUserService`

`nestjs-authorized` expects a user service contract with three methods. The bundled `AuthController` uses `validateUser(...)` during login; the other methods are part of the public contract for custom flows.

```ts
import { Injectable } from '@nestjs/common';
import { IUserService } from 'nestjs-authorized';

type AppUser = {
  id: number;
  email: string;
  username?: string;
  roles?: string[];
};

@Injectable()
export class UserService implements IUserService<AppUser> {
  async validateUser({
    email,
    username,
    password,
  }: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<AppUser | null> {
    // Replace with your credential validation logic.
    return {
      id: 1,
      email: email ?? 'user@example.com',
      username,
      roles: ['user'],
    };
  }

  async findById(id: string | number): Promise<AppUser | null> {
    return {
      id: Number(id),
      email: 'user@example.com',
      username: 'demo',
      roles: ['user'],
    };
  }

  async findByPayload(payload: any): Promise<AppUser | null> {
    return {
      id: Number(payload.sub),
      email: payload.email ?? 'user@example.com',
      username: payload.username,
      roles: payload.roles ?? ['user'],
    };
  }
}
```

## 2. Register `AuthModule`

```ts
import { Module } from '@nestjs/common';
import { AuthController, AuthModule, JwtModuleOptions } from 'nestjs-authorized';
import { UserService } from './user.service';

const jwtOptions: JwtModuleOptions = {
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  accessTokenExpiresIn: '15m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  refreshTokenExpiresIn: '7d',
};

@Module({
  imports: [AuthModule.forRoot(jwtOptions, { provide: 'UserService', useClass: UserService })],
  providers: [UserService],
  controllers: [AuthController],
})
export class AppModule {}
```

If you mount the bundled `AuthController`, the user service provider must use the `'UserService'` token because the controller injects that token directly.

## 3. Use The Built-In Endpoints

The bundled controller exposes:

- `POST /auth/login` with `email` or `username` plus `password`
- `POST /auth/refresh` with `{ "refreshToken": "..." }` in the request body
- `POST /auth/me` with an `Authorization: Bearer <access-token>` header

`POST /auth/login` returns:

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "roles": ["user"]
  }
}
```

`POST /auth/me` returns the validated JWT payload currently attached by the guard.

## 4. Build Your Own Controller If Needed

If you do not want the bundled controller, you can register only the module and use the exported `JwtService`, `JwtAuthGuard`, and `RefreshTokenGuard` in your own endpoints.

See [api.md](api.md) for the full exported surface.
