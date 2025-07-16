import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService, JwtModuleOptions } from '../services/jwt.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RefreshTokenStrategy } from '../strategies/refresh-token.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { IUserService } from '../interfaces/user-service.interface';

@Global()
@Module({})
export class AuthModule {
  static forRoot(options: JwtModuleOptions, userServiceProvider: Provider<IUserService>): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule.register({}), // Используем только для DI JwtService
      ],
      providers: [
        { provide: 'JWT_MODULE_OPTIONS', useValue: options },
        JwtService,
        JwtStrategy,
        RefreshTokenStrategy,
        JwtAuthGuard,
        RefreshTokenGuard,
        userServiceProvider,
      ],
      exports: [
        JwtService,
        JwtStrategy,
        RefreshTokenStrategy,
        JwtAuthGuard,
        RefreshTokenGuard,
        userServiceProvider,
      ],
      global: true,
    };
  }
}
