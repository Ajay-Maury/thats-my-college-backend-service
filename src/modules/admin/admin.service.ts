import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.services';
import { LoginAdminUserDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly authService: AuthService) {}

  async adminLogin(loginAdminUserDto: LoginAdminUserDto) {
    return await this.authService.authenticateAdminUser(loginAdminUserDto);
  }
}
