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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserFormDto,
  UserEmailDto,
} from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
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
  @ApiOperation({ summary: 'create or update user by oauth login' })
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
  @ApiOperation({ summary: 'get all users' })
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
  @ApiOperation({ summary: 'update user role by user email' })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponseDto })
  async updateUserRole(
    @Res() res,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const { email } = updateUserRoleDto;
    console.log('email:', email);
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
  @ApiOperation({ summary: 'delete user by user id' })
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
