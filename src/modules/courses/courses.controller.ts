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
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAuthToken } from 'src/common/decorators/getAuthToken.decorator';
import { UserRoleEnum } from 'src/utils/enums/users.enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { CoursesService } from './courses.service';
import {
  CourseDataWithCollegeDetailsResponseDto,
  CourseResponseArrayDto,
  CourseResponseDto,
} from './dto/course-response.dto';
import { CourseFilterDto, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { KeyPermissionsGuard } from '../auth/guards/key-permission.gaurd';
import { SWAGGER_CONSTANTS } from 'src/utils/constants';

@Controller('courses')
@ApiTags('courses')
export class CoursesController {
  // Initialize a logger instance for logging messages related to this controller.
  // Logger for the CollegeController class.
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  ) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token. and RoleGuard will check user has particular roles or not
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY) // Swagger decorator indicating that JWT token is required for this controller.
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseResponseDto })
  @ApiOperation({ summary: 'Create courses for college' })
  public async createCollegeCourses(
    @Request() req,
    @Res() res,
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CourseResponseDto> {
    try {
      const userId = req?.user?._id;
      // Log that the process of creating a new course with college id has started.
      this.logger.log(`Initiated creating new course`);
      const courses = await this.coursesService.createCourse(
        createCourseDto,
        userId,
      );
      this.logger.log(`Successfully Created new courses`);
      return res.status(HttpStatus.CREATED).json({
        status: true,
        data: courses,
        message: `Successfully created college courses`,
      });
    } catch (error) {
      this.logger.error(`Failed to Create courses for college`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Get()
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiResponse({ status: HttpStatus.OK, type: Array<CourseResponseArrayDto> })
  @ApiOperation({ summary: "Get all college's courses" })
  public async findAllCollegeCourses(
    @Res() res,
  ): Promise<CourseResponseArrayDto> {
    try {
      this.logger.log(`Initiated geting all collges courses`);
      const courses = await this.coursesService.findAllCourses();

      this.logger.log(`Successfully fetched all courses`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: courses,
        message: 'Successfully fetched all courses',
      });
    } catch (error) {
      this.logger.error(`Failed to Get all college's courses`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: [], message: error.message });
    }
  }

  @Get(':courseId')
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'Get course by course id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async getOneCourseByCourseId(
    @Res() res,
    @Param('courseId') courseId: string,
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated geting course with course Id`);
      const course = await this.coursesService.findOneCourseByCourseId(
        courseId,
      );
      this.logger.log(`Successfully fetched course by course id`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: course,
        message: `Successfully fetched course by course id #${courseId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to Get course by course id`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Get('college/:collegeId')
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'get course by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async getCourseByCollegeId(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated geting courses by course Id`);
      const course = await this.coursesService.findCourseByCollegeId(collegeId);

      this.logger.log(`Successfully get course by college id`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: course,
        message: `Successfully get course by college id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to get course by college id`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Get('get-all/college-details')
  @UseGuards(KeyPermissionsGuard)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY)
  @ApiOperation({ summary: 'get all courses with college details' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseDataWithCollegeDetailsResponseDto,
  })
  public async getCourseForAllColleges(
    @Res() res,
    @Query() filter: CourseFilterDto,
  ): Promise<CourseDataWithCollegeDetailsResponseDto> {
    try {
      this.logger.log(`Initiated get all courses with college details`);
      const course = await this.coursesService.findCourseForAllColleges(filter);

      this.logger.log(`Successfully get all courses with college details`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: course,
        message: `Successfully get all courses with college details`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to get all courses with college details`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Patch(':courseId')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  ) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY) // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Update course by course id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCourseId(
    @Request() req,
    @Res() res,
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    try {
      const userId = req?.user?._id;
      this.logger.log(`Initiated updating courses by course Id #${courseId}`);
      const course = await this.coursesService.updateCourseByCourseId(
        courseId,
        updateCourseDto,
        userId,
      );

      this.logger.log(`Successfully Updated course by course id #${courseId}`);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: course,
        message: `Successfully Updated course by course id #${courseId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update course by course Id #${courseId}`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Patch('college/:collegeId')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  ) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY) // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Update course by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCollegeId(
    @Request() req,
    @Res() res,
    @Param('collegeId') collegeId: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    try {
      const userId = req?.user?._id;
      this.logger.log(`Initiated Update course by college id #${collegeId}`);
      const course = await this.coursesService.updateCourseByCollegeId(
        collegeId,
        updateCourseDto,
        userId,
      );

      this.logger.log(
        `Successfully Updated course by college id #${collegeId}`,
      );
      return res.status(HttpStatus.OK).json({
        status: true,
        data: course,
        message: `Successfully Updated course by college id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update course by college Id #${collegeId}`,
        error,
      );
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Delete(':courseId')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  ) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY) // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Delete course by course id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async removeCourseByCourseId(
    @Res() res,
    @Param('courseId') courseId: string,
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated Delete course by course id`);
      await this.coursesService.removeCourseByCourseId(courseId);

      this.logger.log(`Successfully deleted course by course id`);
      return res.status(HttpStatus.OK).json({
        status: true,
        message: `Successfully deleted course by course id #${courseId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to delete course by course Id`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Delete('college/:collegeId')
  @UseGuards(
    JwtAuthGuard,
    KeyPermissionsGuard,
    new RoleGuard([UserRoleEnum.ADMIN]),
  ) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT)
  @ApiBearerAuth(SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY) // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Delete courses by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async removeCourseByCollegeId(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated Delete courses by college id`);
      await this.coursesService.removeCourseByCollegeId(collegeId);

      this.logger.log(`Successfully deleted course by college id`);
      return res.status(HttpStatus.OK).json({
        status: true,
        message: `Successfully deleted course by college id #${collegeId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to delete course by college Id`, error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }
}
