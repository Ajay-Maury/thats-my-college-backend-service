import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoleEnum } from 'src/utils/enums/users.enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  CreateUserDto,
  CreateUserFormDto,
  UserEmailDto,
} from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { KeyPermissionsGuard } from '../auth/guards/key-permission.gaurd';
import { SWAGGER_CONSTANTS } from 'src/utils/constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'create new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  async createUser(
    @Res() res,
    @Body() createUserFormDto: CreateUserFormDto,
  ): Promise<UserResponseDto> {
    try {
      this.logger.log(
        `Initiated create new user with email: ${createUserFormDto.email}`,
      );
      const user = await this.usersService.createUser(createUserFormDto);

      this.logger.log(
        `Successfully create new user with email: ${createUserFormDto.email}`,
      );
      return res.status(HttpStatus.CREATED).json({
        message: `Successfully created new user with user id #${user.id}`,
        data: user,
        status: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create new user with email: ${createUserFormDto.email}`,
        error,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        status: false,
      });
    }
  }

  @Post('oauth-login')
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'create user by oauth login details' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseDto })
  async oauthLogin(
    @Res() res,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      this.logger.log(
        `Initiated creating new user with email: ${createUserDto.email}`,
      );
      const user = await this.usersService.oauthLogin(createUserDto);

      this.logger.log(
        `Successfully created new user with email: ${createUserDto.email}`,
      );
      return res.status(HttpStatus.CREATED).json({
        message: `Successfully created new user with email:- ${user.email}`,
        data: user,
        status: true,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create new user with email: ${createUserDto.email}`,
        error,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
        status: false,
      });
    }
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN]),
  )
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'get all users (for admin use only)' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto, isArray: true })
  async findAllUsers(@Res() res): Promise<UserResponseDto[]> {
    try {
      this.logger.log(`Initiated fetching all users`);
      const users = await this.usersService.findAllUsers();
      this.logger.log(`Successfully fetched all users`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully fetched all users`,
        data: users,
        status: true,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch all users`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'get user by user id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async findOneUserById(@Res() res, @Param('userId') userId: string) {
    try {
      this.logger.log(`Initiated fetching user by user id #${userId}`);
      const user = await this.usersService.findOneUserById(userId);
      this.logger.log(`Successfully fetched user by user id #${userId}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully fetched user by user id #${userId}`,
        data: user,
        status: true,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch user by user id #${userId}`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }

  @Get('email/:email')
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'get user by email id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async findOneUserByEmail(@Res() res, @Param() userEmailDto: UserEmailDto) {
    const { email } = userEmailDto;
    try {
      this.logger.log(`Initiated fetching user by email:- ${email}`);
      const user = await this.usersService.getUserByEmail(email);
      this.logger.log(`Successfully fetched user by email:- ${email}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully fetched user by email:- ${email}`,
        data: user,
        status: true,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch user by email:- ${email}`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'update user by user id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async updateUserById(
    @Res() res,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      this.logger.log(`Initiated updating user by user id #${userId}`);
      const updatedUser = await this.usersService.updateUserById(
        userId,
        updateUserDto,
      );
      this.logger.log(`Successfully updated user by user id #${userId}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated user by user id #${userId}`,
        status: true,
        data: updatedUser,
      });
    } catch (error) {
      this.logger.error(`Failed to update user by user id #${userId}`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }

  @Patch('role/update')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.SUPER_ADMIN]),
  )
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({
    summary: 'update user role by user email (for admin use only)',
  })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async updateUserRole(
    @Res() res,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const { email } = updateUserRoleDto;
    try {
      this.logger.log(`Initiated updating user role by user email:- ${email}`);
      const updatedUser = await this.usersService.updateUserRole(
        updateUserRoleDto,
      );
      this.logger.log(
        `Successfully updated user role by user email:- ${email}`,
      );
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated user role by user email:- ${email}`,
        status: true,
        data: updatedUser,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update user role by user email:- ${email}`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }

  @Delete(':userId')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  )
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'delete user by user id (for admin use only)' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async removeUserById(@Res() res, @Param('userId') userId: string) {
    try {
      this.logger.log(`Initiated deleting user by user id #${userId}`);
      await this.usersService.removeUserById(userId);
      this.logger.log(`Successfully deleted user by user id #${userId}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted user by user id #${userId}`,
        status: true,
      });
    } catch (error) {
      this.logger.error(`Failed to delete user by user id #${userId}`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }
}
