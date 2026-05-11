# API Reference

## Public Exports

The package entrypoint exports:

- `AuthModule`
- `AuthController`
- `JwtService`
- `JwtAuthGuard`
- `RefreshTokenGuard`
- `JwtStrategy`
- `RefreshTokenStrategy`
- `LoginDto`
- `RefreshTokenDto`
- `IUserService`
- `JwtPayload`
- `JwtModuleOptions`

## `AuthModule`

```ts
AuthModule.forRoot(options: JwtModuleOptions, userServiceProvider: Provider<IUserService>)
```

Registers the auth module as global and wires:

- the library `JwtService`
- both Passport strategies
- both guards
- your provided user service

## `JwtModuleOptions`

```ts
type JwtModuleOptions = {
  accessTokenSecret: string;
  accessTokenExpiresIn: JwtSignOptions['expiresIn'];
  refreshTokenSecret: string;
  refreshTokenExpiresIn: JwtSignOptions['expiresIn'];
};
```

Use different secrets and expirations for access and refresh tokens. In practice this means the same `expiresIn` values accepted by `@nestjs/jwt`, for example `'15m'`, `'7d'`, or a numeric value in seconds.

## `IUserService<TUser>`

```ts
interface IUserService<TUser = any> {
  validateUser(credentials: {
    email?: string;
    username?: string;
    password: string;
  }): Promise<TUser | null>;
  findById(id: string | number): Promise<TUser | null>;
  findByPayload(payload: any): Promise<TUser | null>;
}
```

`validateUser(...)` is required by the bundled login endpoint. The rest of the contract is available for custom integrations and future extension.

## `AuthController`

The bundled controller lives under the `/auth` prefix and provides:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/me`

Important runtime behavior:

- `login` signs both access and refresh tokens from `{ sub, email, username, roles }`
- `refresh` expects `refreshToken` in the request body
- `me` returns the authenticated request payload produced by `JwtAuthGuard`
- to use the controller as-is, your provider must be registered with the `'UserService'` token

## Guards And Strategies

- `JwtAuthGuard` wraps Passport's `jwt` strategy and reads the access token from the `Authorization` bearer header
- `RefreshTokenGuard` wraps Passport's `jwt-refresh` strategy and reads the refresh token from the `refreshToken` body field
- `JwtStrategy` validates access tokens with `accessTokenSecret`
- `RefreshTokenStrategy` validates refresh tokens with `refreshTokenSecret`

## DTOs

- `LoginDto` accepts `email` or `username`, plus `password`
- `RefreshTokenDto` accepts `refreshToken`

## Notes

- Refresh tokens are stateless: the package does not persist or revoke them for you
- The packaged strategies currently return the JWT payload directly rather than hydrating a user entity
- If you need cookie-based refresh flows or token revocation, build those concerns in your application layer around the exported module and guards
