import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';

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
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      this.logger.log(
        `Initiated create new user with email: ${createUserDto.email}`,
      );
      const user = await this.usersService.createUser(createUserDto);

      this.logger.log(
        `Successfully create new user with email: ${createUserDto.email}`,
      );
      return res.status(HttpStatus.CREATED).json({
        message: `Successfully created new user with user id #${user}`,
        data: user,
        status: true,
      });
    } catch (error) {
      this.logger.error,
        error({
          message: `Failed to create new user with email: ${createUserDto.email}`,
        });
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
