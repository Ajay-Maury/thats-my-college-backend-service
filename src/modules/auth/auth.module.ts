import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.services';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthController } from './auth.controller';
import { CONFIG } from 'src/config/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule with JWT strategy as the default.
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to access configuration values.
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get the JWT secret from the configuration.
        signOptions: { expiresIn: CONFIG.JWT_TOKEN_EXPIRY }, // Define token expiration time.
      }),
      inject: [ConfigService], // Inject the ConfigService to access configuration values.
    }),
    UsersModule, // Import the UsersModule, which might contain user-related functionality.
  ],
  controllers: [AuthController], // Register the AuthController for handling HTTP requests related to authentication.
  providers: [AuthService, JwtStrategy], // Register the AuthService and JwtStrategy as providers.
  exports: [PassportModule, AuthService], // Export PassportModule and AuthService to be used in other modules.
})
export class AuthModule {}
