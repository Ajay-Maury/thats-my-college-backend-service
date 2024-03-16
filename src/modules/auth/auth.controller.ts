import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.services';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthenticateUserDto,
  UserAuthTokenResponse,
} from './dto/user-auth.dto';
import { KeyPermissionsGuard } from './guards/key-permission.gaurd';
import { SWAGGER_CONSTANTS } from 'src/utils/constants';

@Controller('auth') // Define the base route for this controller.
@ApiTags('auth') // Add Swagger tags for documentation.
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {} // Inject AuthService to access authentication logic.

  @Post('') // Define a POST endpoint for user authentication.
  @ApiOperation({ summary: 'authenticate user' }) // Describe the operation for Swagger.
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiResponse({ status: HttpStatus.OK, type: UserAuthTokenResponse }) // Describe the response for Swagger.
  async authenticateUser(
    @Res() res, // Response object for sending HTTP responses.
    @Body() authenticateUserDto: AuthenticateUserDto, // Request body containing user authentication data.
  ) {
    try {
      // Log that the authentication process has started for a user.
      this.logger.log(
        `Initiated authenticating user with email: ${authenticateUserDto.email}`,
      );

      // Call the authService to authenticate the user and generate a token.
      const token = await this.authService.authenticateUser(
        authenticateUserDto,
      );

      // Log that the user authentication was successful.
      this.logger.log(
        `Successfully authenticated user with email: ${authenticateUserDto.email}`,
      );

      // Return a success response with the authentication token.
      return res.status(HttpStatus.OK).json({
        message: `Successfully authenticated user with email: ${authenticateUserDto.email}`,
        authToken: token,
        status: true,
      });
    } catch (error) {
      // Log an error message if user authentication fails.
      this.logger.error(
        `Failed to authenticate user with email: ${authenticateUserDto.email}`,
        error,
      );

      // Return an error response with a detailed error message.
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message, status: false });
    }
  }
}
