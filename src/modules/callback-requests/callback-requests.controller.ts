import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
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
import { CallbackRequestsService } from './callback-requests.service';
import { ResponseCallbackRequestDto } from './dto/response-callback-request.dto';

@Controller('callback-requests')
@ApiTags('callback-requests')
export class CallbackRequestsController {
  private readonly logger = new Logger(CallbackRequestsController.name);
  constructor(
    private readonly callbackRequestsService: CallbackRequestsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary:
      'Check if callback request exists for a user, if not create a new one',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseCallbackRequestDto })
  async checkCallbackRequestForUser(@Req() req, @Res() res) {
    const user = req?.user;
    const userId = user?._id;
    try {
      this.logger.log(
        `Initiated creating callback request for userId:- #${userId}`,
      );
      const callbackRequestResponse = await this.callbackRequestsService.create(
        userId,
      );
      this.logger.log(
        callbackRequestResponse?.message ||
          `Successfully created callback request for userId:- #${userId}`,
      );
      return res.status(HttpStatus.OK).json({ ...callbackRequestResponse });
    } catch (error) {
      this.logger.error(
        `Failed create to callback request for userId:- #${userId}`,
        error,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          `Failed to create callback request for user with email:- #${user?.email}`,
      });
    }
  }

  @Get(':userId')
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN]),
  )
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Get all callback request of a user (admin use only)',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseCallbackRequestDto })
  async findOne(@Param('userId') userId: string, @Res() res) {
    try {
      this.logger.log(
        `Initiated fetching callback request for userId:- #${userId}`,
      );
      const response = await this.callbackRequestsService.getByUserId(userId);
      this.logger.log(
        `Successfully fetched callback request for userId:- #${userId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: `Successfully fetched callback request for userId:- #${userId}`,
        data: response,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch callback request for userId:- #${userId}`,
        error,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          `Failed to fetch callback request for userId:- #${userId}`,
      });
    }
  }

  @Delete(':userId')
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN]),
  )
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Delete one callback request of a user (admin use only)',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseCallbackRequestDto })
  async remove(@Param('userId') userId: string, @Res() res) {
    try {
      this.logger.log(
        `Initiated deleting callback request for userId:- #${userId}`,
      );
      const response = await this.callbackRequestsService.remove(userId);
      this.logger.log(
        `Successfully deleted callback request for userId:- #${userId}`,
      );
      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted callback request for userId:- #${userId}`,
        data: response,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete callback request for userId:- #${userId}`,
        error,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error.message ||
          `Failed to delete callback request for userId:- #${userId}`,
      });
    }
  }
}
