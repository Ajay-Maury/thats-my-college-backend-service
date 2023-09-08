import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';
import { Model } from 'mongoose';
import { CourseDataDto } from './dto/course-response.dto';

@Injectable()
export class CoursesService {

  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>
  ) { }

  async createCourse(createCourseDto: CreateCourseDto): Promise<CourseDataDto> {
    return await this.courseModel.create(createCourseDto)
  }

  async findAllCourses(): Promise<CourseDataDto[]> {
    return await this.courseModel.find()
  }

  async findOneCourseByCourseId(courseId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findById(courseId)
    if (!course)
      throw new NotFoundException(`Course with id #${courseId} not found`)
    return course
  }

  async findCourseByCollegeId(collegeId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findOne({ collegeId })
    if (!course)
      throw new NotFoundException(`Course with college id #${collegeId} not found`)
    return course
  }

  async updateCourseByCourseId(courseId: string, updateCourseDto: UpdateCourseDto): Promise<CourseDataDto> {
    const existingCourse = await this.courseModel.findByIdAndUpdate(courseId, updateCourseDto, { new: true })
    if (!existingCourse)
      throw new NotFoundException(`Course with id #${courseId} not found`)
    return existingCourse
  }

  async updateCourseByCollegeId(collegeId: string, updateCourseDto: UpdateCourseDto) {
    const existingCourse = await this.courseModel.updateOne({ collegeId }, updateCourseDto).lean().exec();
    if (!existingCourse.acknowledged) {
      throw new NotFoundException(`Course with college id #${collegeId} not found`);
    }
    return existingCourse;
  }
  

  async removeCourseByCourseId(courseId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findByIdAndDelete(courseId)
    if (!course)
      throw new NotFoundException(`Course with course id #${courseId} not found`)
    return course
  }

  async removeCourseByCollegeId(collegeId: string) {
    const result = await this.courseModel.deleteOne({ collegeId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Course with college id #${collegeId} not found`);
    }
    return result;
  }
  
}
