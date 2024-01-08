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
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdmissionApplicationService } from './admission-application.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import {
  UpdateAdmissionApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/update-admission-application.dto';
import {
  AdmissionApplicationArrayResponseDto,
  AdmissionApplicationResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRoleEnum } from 'src/utils/enums/users.enums';
import { Response } from 'express';

@Controller('admission-application')
@ApiTags('admission-application')
export class AdmissionApplicationController {
  private readonly logger = new Logger(AdmissionApplicationController.name);
  constructor(
    private readonly admissionApplicationService: AdmissionApplicationService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'create a new admission application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AdmissionApplicationResponseDto,
  })
  async create(
    @Res() res: Response,
    @Req() req,
    @Body() createAdmissionApplicationDto: CreateAdmissionApplicationDto,
  ) {
    const userId = req?.user?._id;
    try {
      this.logger.log(
        `Initiated creating new admission application for userId:- #${userId}`,
      );

      const admissionApplication =
        await this.admissionApplicationService.create(
          createAdmissionApplicationDto,
          userId,
        );

      this.logger.log(
        `Successfully created new admission application for userId:- #${userId}`,
      );

      return res.status(HttpStatus.CREATED).json({
        status: true,
        data: admissionApplication,
        message: `Successfully created new admission application for userId:- #${userId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create new admission application for userId:- #${userId}`,
        error,
      );

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN]))
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all admission applications (admin use only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AdmissionApplicationArrayResponseDto,
  })
  async findAll(@Res() res: Response) {
    try {
      this.logger.log('Initiated fetching all admission applications');

      const applications = await this.admissionApplicationService.findAll();

      this.logger.log('Successfully fetched  all admission applications');

      return res.status(HttpStatus.OK).json({
        status: true,
        data: applications,
        message: 'Successfully fetched  all admission applications',
      });
    } catch (error) {
      this.logger.error(`Failed to fetch all admission application`, error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Get all admission applications with user id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AdmissionApplicationArrayResponseDto,
  })
  async findAllAdmissionApplicationByUserId(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    try {
      const user = req?.user;
      if (
        user._id !== userId &&
        !user.role.some((role: UserRoleEnum) =>
          [UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN].includes(role),
        )
      ) {
        throw new Error(`Invalid user`);
      }

      this.logger.log(
        `Initiated fetching admission applications with user id #${userId}`,
      );

      const applications =
        await this.admissionApplicationService.findAllAdmissionApplicationByUserId(
          userId,
        );

      this.logger.log(
        `Successfully fetched admission applications with user id #${userId}`,
      );

      return res.status(HttpStatus.OK).json({
        status: true,
        data: applications,
        message: `Successfully fetched admission applications with user id #${userId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch admission applications with user id #${userId}`,
        error,
      );

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'get admission application with id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AdmissionApplicationResponseDto,
  })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      this.logger.log(
        `Initiated fetching admission applications with id #${id}`,
      );

      const application = await this.admissionApplicationService.findOne(id);

      this.logger.log(
        `Successfully fetched admission applications with id #${id}`,
      );

      return res.status(HttpStatus.OK).json({
        status: true,
        data: application,
        message: `Successfully fetched admission applications with id #${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch admission applications with id #${id}`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'update admission application with id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AdmissionApplicationResponseDto,
  })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAdmissionApplicationDto: UpdateAdmissionApplicationDto,
  ) {
    try {
      this.logger.log(
        `Initiated updated admission applications with id #${id}`,
      );

      const application = await this.admissionApplicationService.update(
        id,
        updateAdmissionApplicationDto,
      );

      this.logger.log(
        `Successfully updated admission applications with id #${id}`,
      );

      return res.status(HttpStatus.OK).json({
        status: true,
        data: application,
        message: `Successfully updated admission applications with id #${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update admission applications with id #${id}`,
        error,
      );

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Patch('update-status/:id')
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN]))
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'update admission application status with id (admin use only)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AdmissionApplicationResponseDto,
  })
  async updateAdmissionApplicationStatus(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    try {
      this.logger.log(
        `Initiated updating admission application status with id #${id}`,
      );

      const application =
        await this.admissionApplicationService.updateAdmissionApplicationStatus(
          id,
          updateApplicationStatusDto,
        );

      this.logger.log(
        `Successfully updated admission applications status with id #${id}`,
      );

      return res.status(HttpStatus.OK).json({
        status: true,
        data: application,
        message: `Successfully updated admission applications status with id #${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update admission applications status with id #${id}`,
        error,
      );

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Delete(':userId/:applicationId')
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN]))
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'delete admission application with id' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AdmissionApplicationResponseDto,
  })
  async remove(
    @Res() res: Response,
    @Param('applicationId') id: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    try {
      const user = req?.user;
      if (
        user._id !== userId &&
        !user.role.some((role: UserRoleEnum) =>
          [UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN].includes(role),
        )
      ) {
        throw new Error(`Invalid user`);
      }
      this.logger.log(
        `Initiated deleting admission application with id #${id}`,
      );

      await this.admissionApplicationService.remove(id);

      this.logger.log(
        `Successfully deleted admission application with id #${id}`,
      );

      return res.status(HttpStatus.OK).json({
        status: true,
        message: `Successfully deleted admission application with id #${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete admission applications with id #${id}`,
        error,
      );

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }
}
