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
import { AdmissionApplicationService } from './admission-application.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';
import { AdmissionApplicationArrayResponseDto, AdmissionApplicationResponseDto } from './dto';

@Controller('admission-application')
@ApiTags('admission-application')
export class AdmissionApplicationController {
  private readonly logger = new Logger(AdmissionApplicationController.name);
  constructor(
    private readonly admissionApplicationService: AdmissionApplicationService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'create a new admission application' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdmissionApplicationResponseDto })
  async create(
    @Res() res,
    @Body() createAdmissionApplicationDto: CreateAdmissionApplicationDto,
  ) {
    try {
      this.logger.log(`Initiated creating new admission application`)

      const admissionApplication = await this.admissionApplicationService.create(createAdmissionApplicationDto,);

      this.logger.log(`Successfully created new admission application`)

      return res.status(HttpStatus.CREATED).json({ status: true, data: admissionApplication, message: "" });
    } catch (error) {
      this.logger.error(`Failed to create new admission application`, error)

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  @Get()
  @ApiOperation({ summary: "Get all admission applications" })
  @ApiResponse({ status: HttpStatus.OK, type: AdmissionApplicationArrayResponseDto })
  async findAll(@Res() res) {
    try {
      this.logger.log('Initiated fetching all admission applications')

      const applications = await this.admissionApplicationService.findAll();

      this.logger.log('Successfully fetched  all admission applications')

      return res.status(HttpStatus.OK).json({ status: true, data: applications, message: 'Successfully fetched  all admission applications' })
    } catch (error) {
      this.logger.error(`Failed to fetch all admission application`, error)

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });

    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get all admission applications with user id" })
  @ApiResponse({ status: HttpStatus.OK, type: AdmissionApplicationArrayResponseDto })
  async findAllAdmissionApplicationByUserId(@Res() res,
    @Param('userId') userId: string,
  ) {
    try {
      this.logger.log(`Initiated fetching admission applications with user id #${userId}`)

      const applications = await this.admissionApplicationService.findAllAdmissionApplicationByUserId(userId);

      this.logger.log(`Successfully fetched admission applications with user id #${userId}`)

      return res.status(HttpStatus.OK).json({ status: true, data: applications, message: `Successfully fetched admission applications with user id #${userId}` })
    } catch (error) {
      this.logger.error(`Failed to fetch admission applications with user id #${userId}`, error)

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });

    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'get admission application with id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdmissionApplicationResponseDto })
  async findOne(@Res() res, @Param('id') id: string) {
    try {
      this.logger.log(`Initiated fetching admission applications with id #${id}`)

      const application = await this.admissionApplicationService.findOne(id);

      this.logger.log(`Successfully fetched admission applications with id #${id}`)

      return res.status(HttpStatus.OK).json({ status: true, data: application, message: `Successfully fetched admission applications with id #${id}` })
    } catch (error) {
      this.logger.error(`Failed to fetch admission applications with id #${id}`, error)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });

    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update admission application with id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdmissionApplicationResponseDto })
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() updateAdmissionApplicationDto: UpdateAdmissionApplicationDto,
  ) {

    try {
      this.logger.log(`Initiated updated admission applications with id #${id}`)

      const application = await this.admissionApplicationService.update(
        id,
        updateAdmissionApplicationDto,
      );

      this.logger.log(`Successfully updated admission applications with id #${id}`)

      return res.status(HttpStatus.OK).json({ status: true, data: application, message: `Successfully updated admission applications with id #${id}` })
    } catch (error) {
      this.logger.error(`Failed to update admission applications with id #${id}`, error)

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });

    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete admission application with id' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdmissionApplicationResponseDto })
  async remove(@Res() res, @Param('id') id: string) {
    try {
      this.logger.log(`Initiated deleting admission application with id #${id}`)

      await this.admissionApplicationService.remove(id);

      this.logger.log(`Successfully deleted admission application with id #${id}`)

      return res.status(HttpStatus.OK).json({ status: true, message: `Successfully deleted admission application with id #${id}` })
    } catch (error) {
      this.logger.error(`Failed to delete admission applications with id #${id}`, error)

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });

    }
  }
}
