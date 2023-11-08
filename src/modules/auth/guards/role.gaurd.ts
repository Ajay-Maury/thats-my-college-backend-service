import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user has one of the specified roles
    if (user && this.roles.includes(user.role)) {
      return true; // Allow access for users with the specified roles
    }

    return false; // Deny access for users without the specified roles
  }
}
