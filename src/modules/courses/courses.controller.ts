import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseFilterDto, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CourseDataWithCollegeDetailsResponseDto,
  CourseResponseArrayDto,
  CourseResponseDto,
} from './dto/course-response.dto';
import { GetAuthToken } from 'src/common/decorators/getAuthToken.decorator';

@Controller('courses')
@ApiTags('courses')
export class CoursesController {
  // Initialize a logger instance for logging messages related to this controller.
  // Logger for the CollegeController class.
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseResponseDto })
  @ApiOperation({ summary: 'Create courses for college' })
  public async createCollegeCourses(
    @Res() res,
    @Body() createCourseDto: CreateCourseDto,
    @GetAuthToken() authorization: string, // custom decorator GetAuthToken to get authorization token string
  ): Promise<CourseResponseDto> {
    try {
      // Log that the process of creating a new course with college id has started.
      this.logger.log(`Initiated creating new course`);
      const courses = await this.coursesService.createCourse(
        createCourseDto,
        authorization,
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
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Update course by course id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCourseId(
    @Res() res,
    @Param('courseId') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @GetAuthToken() authorization: string, // custom decorator GetAuthToken to get authorization token string
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated updating courses by course Id #${courseId}`);
      const course = await this.coursesService.updateCourseByCourseId(
        courseId,
        updateCourseDto,
        authorization,
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
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
  @ApiOperation({ summary: 'Update course by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCollegeId(
    @Res() res,
    @Param('collegeId') collegeId: string,
    @GetAuthToken() authorization: string, // custom decorator GetAuthToken to get authorization token string

    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseResponseDto> {
    try {
      this.logger.log(`Initiated Update course by college id #${collegeId}`);
      const course = await this.coursesService.updateCourseByCollegeId(
        collegeId,
        updateCourseDto,
        authorization,
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
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
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
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard for authentication before accessing controller methods. This guard ensures that the user is authenticated with a valid JWT token.
  @ApiBearerAuth('jwt') // Swagger decorator indicating that JWT token is required for this controller.
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
