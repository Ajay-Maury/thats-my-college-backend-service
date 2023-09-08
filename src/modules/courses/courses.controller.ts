import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CourseResponseArrayDto, CourseResponseDto } from './dto/course-response.dto';

@Controller('courses')
@ApiTags('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CourseResponseDto })
  @ApiOperation({ summary: "Create courses for college" })
  public async createCollegeCourses(@Res() res, @Body() createCourseDto: CreateCourseDto): Promise<CourseResponseDto> {
    try {
      const courses = await this.coursesService.createCourse(createCourseDto)
      return res.status(HttpStatus.CREATED).json({ status: true, data: courses, message: `Successfully created college courses` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message });
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: Array<CourseResponseArrayDto> })
  @ApiOperation({ summary: "Get all college's courses" })
  public async findAllCollegeCourses(@Res() res): Promise<CourseResponseArrayDto> {
    try {
      const courses = await this.coursesService.findAllCourses()
      return res.status(HttpStatus.OK).json({ status: true, data: courses, message: "Successfully fetched all courses" })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: [], message: error.message })
    }
  }

  @Get(':courseId')
  @ApiOperation({ summary: "Get course by course id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async getOneCourseByCourseId(@Res() res, @Param('courseId') courseId: string): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.findOneCourseByCourseId(courseId)
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully fetched course by course id #${courseId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }

  @Get('college/:collegeId')
  @ApiOperation({ summary: "get course by college id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async getCourseByCollegeId(@Res() res, @Param('collegeId') collegeId: string): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.findCourseByCollegeId(collegeId)
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully get course by college id #${collegeId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }

  @Patch(':courseId')
  @ApiOperation({ summary: "Update course by course id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCourseId(@Res() res, @Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.updateCourseByCourseId(courseId, updateCourseDto)
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully Updated course by course id #${courseId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }

  @Patch('college/:collegeId')
  @ApiOperation({ summary: "Update course by college id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async updateCourseByCollegeId(@Res() res, @Param('collegeId') collegeId: string, @Body() updateCourseDto: UpdateCourseDto): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.updateCourseByCollegeId(collegeId, updateCourseDto)
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully Updated course by college id #${collegeId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }

  @Delete(':courseId')
  @ApiOperation({ summary: "Delete course by course id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async removeCourseByCourseId(@Res() res, @Param('courseId') courseId: string): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.removeCourseByCourseId(courseId);
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully deleted course by course id #${courseId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }

  @Delete('college/:collegeId')
  @ApiOperation({ summary: "Delete courses by college id" })
  @ApiResponse({ status: HttpStatus.OK, type: CourseResponseDto })
  public async removeCourseByCollegeId(@Res() res, @Param('collegeId') collegeId: string): Promise<CourseResponseDto> {
    try {
      const course = await this.coursesService.removeCourseByCollegeId(collegeId);
      return res.status(HttpStatus.OK).json({ status: true, data: course, message: `Successfully deleted course by course id #${collegeId}` })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message })
    }
  }
}
