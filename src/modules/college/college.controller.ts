import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Logger,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import Swagger decorators.
import {
  CollegeResponseDto,
  CollegeSingleResponseDto,
} from './dto/college-response.dto';

@Controller('college') // Defines the base route for this controller.
@ApiTags('college') // Adds Swagger tags for documentation.
export class CollegeController {
  private readonly logger = new Logger(CollegeService.name);

  constructor(private readonly collegeService: CollegeService) {}

  // Create a new college.
  @Post()
  @ApiOperation({ summary: 'Create college' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.CREATED, type: CollegeResponseDto }) // Describes the response for Swagger.
  public async createNewCollege(
    @Res() res,
    @Body() createCollegeDto: CreateCollegeDto,
  ): Promise<CollegeResponseDto> {
    try {
      this.logger.log(`Initiated creating new college`);
      const colleges = await this.collegeService.createCollege(
        createCollegeDto,
      );
      this.logger.log(`Successfully created new college`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: colleges,
        message: `Successfully created college`,
      });
    } catch (error) {
      this.logger.error(`Failed to create new college`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: [], message: error.message });
    }
  }

  // Get all colleges.
  @Get()
  @ApiOperation({ summary: 'Get all colleges' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeResponseDto }) // Describes the response for Swagger.
  public async getAllCollege(@Res() res): Promise<CollegeResponseDto> {
    try {
      const colleges = await this.collegeService.findAllCollege();
      return res.status(HttpStatus.OK).json({
        status: true,
        data: colleges,
        message: `Successfully fetched all colleges`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: [], message: error.message });
    }
  }

  // Get a college by college ID.
  @Get(':collegeId')
  @ApiOperation({ summary: 'Get college by college id' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto }) // Describes the response for Swagger.
  public async getOneCollege(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.findOneCollege(collegeId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully fetched college with id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  // Update a college by college ID.
  @Patch(':collegeId')
  @ApiOperation({ summary: 'Update college by college id' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto }) // Describes the response for Swagger.
  public async updateOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
    @Body() updateCollegeDto: UpdateCollegeDto,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.updateCollegeById(
        collegeId,
        updateCollegeDto,
      );
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully updated college with id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  // Delete a college and its courses by college ID.
  @Delete(':collegeId')
  @ApiOperation({ summary: 'Delete college and courses by college id' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto }) // Describes the response for Swagger.
  public async deleteOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.removeCollegeById(collegeId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully deleted college and courses with college id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }
}
