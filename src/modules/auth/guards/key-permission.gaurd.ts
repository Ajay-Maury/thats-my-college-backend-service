import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeyPermissionsGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const configApiKeyValue =
      this.configService.get<string>('TMC_API_CONFIG_KEY');
    const configApiKeyHeaderValue = request.headers['x-tmc-api-config-key'];
    let hasPermissions = false;
    if (configApiKeyValue && configApiKeyValue === configApiKeyHeaderValue) {
      hasPermissions = true;
    }
    return hasPermissions;
  }
}
