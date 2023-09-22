import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // Override the canActivate method to customize the authentication logic.
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); // Call the parent canActivate method for JWT authentication.
  }

  // Override the handleRequest method to customize the response.
  handleRequest(err: any, user: any) {
    if (err || !user) {
      // If there's an error or no user is authenticated, throw an UnauthorizedException.
      throw new UnauthorizedException();
    }

    // Log that the user is authenticated successfully (you can customize this log message).
    this.logger.log(`User ${user.email} is authenticated successfully`);

    return user; // Return the authenticated user.
  }
}
