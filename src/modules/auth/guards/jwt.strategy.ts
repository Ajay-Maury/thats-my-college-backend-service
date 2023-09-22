import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, // Inject the ConfigService to access configuration values.
    private readonly authService: AuthService, // Inject the AuthService to validate users.
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the request's Bearer token.
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get the JWT secret key from configuration.
    });
  }

  // Implement the validate method to verify and retrieve user information from the JWT payload.
  async validate(payload: any) {
    // Use the AuthService to validate the user based on the payload's user ID.
    const user = await this.authService.validateUser(payload.id);

    if (!user) {
      // If the user is not found, throw an UnauthorizedException.
      throw new UnauthorizedException();
    }

    return user; // Return the validated user.
  }
}
