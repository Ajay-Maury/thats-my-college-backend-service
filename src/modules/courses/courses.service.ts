import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseFilterDto, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';
import { Model, PipelineStage } from 'mongoose';
import { CourseDataDto } from './dto/course-response.dto';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
    private readonly entityUtilsService: EntityUtilsService, // Injects the EntityUtilsService.
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    authorization: string,
  ): Promise<CourseDataDto> {
    const createdInfo = await this.entityUtilsService.getCreatedInfo(
      authorization,
    );
    return await this.courseModel.create({
      ...createCourseDto,
      ...createdInfo,
    });
  }

  async findAllCourses(): Promise<CourseDataDto[]> {
    return await this.courseModel.find();
  }

  async findOneCourseByCourseId(courseId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findById(courseId);
    if (!course)
      throw new NotFoundException(`Course with id #${courseId} not found`);
    return course;
  }

  async findCourseByCollegeId(collegeId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findOne({ collegeId });
    if (!course)
      throw new NotFoundException(
        `Course with college id #${collegeId} not found`,
      );
    return course;
  }

  async findOneCourseByQuery(query: object): Promise<CourseDataDto> {
    return await this.courseModel.findOne(query);
  }

  async findCourseForAllColleges(filter: CourseFilterDto) {
    const {
      city,
      collegeType,
      courseName,
      featured,
      rating,
      state,
      limit = 10,
      page = 1,
    } = filter;

    // Build the aggregation pipeline
    const pipeline: PipelineStage[] = [];

    // Match stage for courseName if provided
    if (courseName) {
      pipeline.push({
        $match: { 'courses.courseName': courseName },
      });
    }

    pipeline.push({
      $addFields: {
        collegeObjectId: {
          $convert: {
            input: '$collegeId',
            to: 'objectId',
            onError: 'null',
          },
        },
      },
    });

    // Lookup colleges
    pipeline.push({
      $lookup: {
        from: 'colleges',
        localField: 'collegeObjectId',
        foreignField: '_id',
        as: 'college',
      },
    });

    // Unwind the college array
    pipeline.push({
      $unwind: {
        path: '$college',
        preserveNullAndEmptyArrays: true,
      },
    });

    // Conditional match stage for college filters
    if (city || collegeType || featured || rating || state) {
      const collegeFilters = {};

      if (city) {
        collegeFilters['college.city'] = city;
      }

      if (collegeType) {
        collegeFilters['college.collegeType'] = collegeType;
      }

      if (featured) {
        collegeFilters['college.featured'] = featured === 'true' ? true : false;
      }

      if (rating) {
        collegeFilters['college.rating'] = { $gte: rating };
      }

      if (state) {
        collegeFilters['college.state'] = state;
      }

      pipeline.push({
        $match: collegeFilters,
      });
    }

    const skip = (page - 1) * limit;

    pipeline.push({
      $facet: {
        courses: [{ $skip: skip }, { $limit: limit }],
        totalDocuments: [{ $count: 'totalDocuments' }],
      },
    });

    // Execute the aggregation pipeline
    const response = await this.courseModel.aggregate(pipeline).exec();

    return {
      courses: response[0]?.courses || [],
      totalDocuments: response[0]?.totalDocuments[0]?.totalDocuments || 0,
    };
  }

  async updateCourseByCourseId(
    courseId: string,
    updateCourseDto: UpdateCourseDto,
    authorization: string,
  ): Promise<CourseDataDto> {
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo(
      authorization,
    );
    const existingCourse = await this.courseModel.findByIdAndUpdate(
      courseId,
      { ...updateCourseDto, ...updatedInfo },
      { new: true },
    );
    if (!existingCourse)
      throw new NotFoundException(`Course with id #${courseId} not found`);
    return existingCourse;
  }

  async updateCourseByCollegeId(
    collegeId: string,
    updateCourseDto: UpdateCourseDto,
    authorization: string,
  ) {
    const course = await this.courseModel.findOne({ collegeId });
    if (!course)
      throw new NotFoundException(
        `Course with college id #${collegeId} not found`,
      );
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo(
      authorization,
    );
    const existingCourse = await this.courseModel.updateOne(
      { collegeId },
      { ...updateCourseDto, ...updatedInfo },
      { new: true },
    );
    return existingCourse;
  }

  async removeCourseByCourseId(courseId: string): Promise<CourseDataDto> {
    const course = await this.courseModel.findByIdAndDelete(courseId);
    if (!course)
      throw new NotFoundException(
        `Course with course id #${courseId} not found`,
      );
    return course;
  }

  async removeCourseByCollegeId(collegeId: string) {
    const course = await this.courseModel.findOne({ collegeId });
    if (!course)
      throw new NotFoundException(
        `Course with college id #${collegeId} not found`,
      );
    return await this.courseModel.deleteOne({ collegeId }).exec();
  }
}
