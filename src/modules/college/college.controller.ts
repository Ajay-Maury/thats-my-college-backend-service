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
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'; // Import Swagger decorators.
import { GetAuthToken } from 'src/common/decorators/getAuthToken.decorator';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';
import { UserRoleEnum } from 'src/utils/enums/users.enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CollegeService } from './college.service';
import {
  CollegeResponseDto,
  CollegeSingleResponseDto,
} from './dto/college-response.dto';
import { CollegeFilterDto, CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Controller('college') // Defines the base route for this controller.
@ApiTags('college') // Adds Swagger tags for documentation.
export class CollegeController {
  // Initialize a logger instance for logging messages related to this controller.
  // Logger for the CollegeController class.
  private readonly logger = new Logger(CollegeService.name);

  constructor(
    // Inject the CollegeService for handling college-related operations.
    private readonly collegeService: CollegeService,
    // Inject the EntityUtilsService for handling common entity-related utilities.
    private readonly entityUtilsService: EntityUtilsService,
  ) {}

  // Create a new college.
  @Post()
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN])) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Create college' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.CREATED, type: CollegeResponseDto }) // Describes the response for Swagger.
  public async createNewCollege(
    @Res() res,
    @Body() createCollegeDto: CreateCollegeDto,
    @GetAuthToken() authorization: string, // custom decorator GetAuthToken to get authorization token string
  ): Promise<CollegeResponseDto> {
    try {
      // Log that the process of creating a new college has started.
      this.logger.log(`Initiated creating new college`);

      // Call the collegeService to create a new college with provided data and authorization.
      const college = await this.collegeService.createCollege(
        createCollegeDto,
        authorization,
      );

      // Log that the college creation was successful.
      this.logger.log(`Successfully created new college`);

      // Return a success response with the created college data.
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully created college with id #${college._id}`,
      });
    } catch (error) {
      // Log an error message if there was a failure in creating the college.
      this.logger.error(`Failed to create new college`, error);

      // Return an error response with a detailed error message.
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }

  // Get all colleges.
  @Get()
  @ApiOperation({ summary: 'Get all colleges' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeResponseDto }) // Describes the response for Swagger.
  public async getAllCollege(
    @Res() res,
    @Query() filter: CollegeFilterDto,
  ): Promise<CollegeResponseDto> {
    try {
      this.logger.log(`Initiated getting all college`);

      const colleges = await this.collegeService.findAllCollege(filter);

      // Log that the getting all colleges successfully.
      this.logger.log(`Successfully getting all college`);

      return res.status(HttpStatus.OK).json({
        status: true,
        data: colleges,
        message: `Successfully fetched all colleges`,
      });
    } catch (error) {
      this.logger.error(`Failed to get all college`, error);
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
      this.logger.log(`Initiated getting a college by Id`);
      const college = await this.collegeService.findOneCollege(collegeId);

      // Log that the find a college.
      this.logger.log(`Successfully get a college`);

      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully fetched college with id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to get a college`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  // Update a college by college ID.
  @Patch(':collegeId')
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN])) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Update college by college id' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto }) // Describes the response for Swagger.
  public async updateOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
    @Body() updateCollegeDto: UpdateCollegeDto,
    @GetAuthToken() authorization: string, // custom decorator GetAuthToken to get authorization token string
  ): Promise<CollegeSingleResponseDto> {
    try {
      this.logger.log(`Initiated update a college by Id`);
      const college = await this.collegeService.updateCollegeById(
        collegeId,
        updateCollegeDto,
        authorization,
      );

      // Log that the college updated was successful.
      this.logger.log(`Successfully updated college`);

      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully updated college with id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to update a college`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  // Delete a college and its courses by college ID.
  @Delete(':collegeId')
  @UseGuards(JwtAuthGuard, new RoleGuard([UserRoleEnum.ADMIN])) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Delete college and courses by college id' }) // Describes the operation for Swagger.
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto }) // Describes the response for Swagger.
  public async deleteOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CollegeSingleResponseDto> {
    try {
      this.logger.log(`Initiated delete a college by Id`);
      await this.collegeService.removeCollegeById(collegeId);

      // Log that the college deleted successful.
      this.logger.log(`Successfully deleted college`);

      return res.status(HttpStatus.OK).json({
        status: true,
        message: `Successfully deleted college and courses with college id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to delete a college`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: error.message });
    }
  }
}
