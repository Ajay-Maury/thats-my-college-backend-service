import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminService } from './admin.service';
import {
  LoginAdminUserDto,
  LoginAdminUserResponseDto,
} from './dto/login-admin.dto';
import { KeyPermissionsGuard } from '../auth/guards/key-permission.gaurd';
import { SWAGGER_CONSTANTS } from 'src/utils/constants';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiResponse({ status: HttpStatus.OK, type: LoginAdminUserResponseDto })
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  async adminLogin(
    @Body() loginAdminUserDto: LoginAdminUserDto,
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Initiated admin user login`);

      const response = await this.adminService.adminLogin(loginAdminUserDto);

      this.logger.log(`Successfully logged-in admin user`);

      return res.status(HttpStatus.OK).json({
        message: `Admin login successfully`,
        user: response,
        status: true,
      });
    } catch (error) {
      this.logger.error(`Failed to login admin user`, error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }
}
