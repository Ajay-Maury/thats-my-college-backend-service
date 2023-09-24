import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCollegeDto, CollegeFilterDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CoursesService } from '../courses/courses.service';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';

@Injectable()
export class CollegeService {
  // The constructor of the service class where dependencies are injected.
  constructor(
    @InjectModel(College.name) // Injects the College model using its name.
    private collegeModal: Model<College>, // Represents the College model instance.
    private readonly courseService: CoursesService, // Injects the CoursesService.
    private readonly entityUtilsService: EntityUtilsService, // Injects the EntityUtilsService.
  ) {}

  async createCollege(
    createCollegeDto: CreateCollegeDto,
    authorization: string,
  ) {
    const createdInfo = await this.entityUtilsService.getCreatedInfo(
      authorization,
    );

    return await this.collegeModal.create({
      ...createCollegeDto,
      ...createdInfo,
    });
  }

  async findAllCollege(filter: CollegeFilterDto) {
    const {
      city,
      collegeType,
      featured,
      rating,
      state,
      limit = 10,
      page = 1,
    } = filter;
    // Create an empty query object
    const query: any = {};

    // Add filters to the query object if they are not empty
    if (city) {
      query.city = city;
    }

    if (collegeType) {
      query.collegeType = collegeType;
    }

    if (featured) {
      query.featured = featured === 'true' ? true : false;
    }

    if (rating) {
      query.rating = { $gte: rating };
    }

    if (state) {
      query.state = state;
    }

    // Calculate the number of documents to skip based on the 'page' and 'limit'
    const skip = (page - 1) * limit;

    const colleges = await this.collegeModal
      .find(query)
      .limit(limit)
      .skip(skip)
      .exec();

    // Calculate the total number of pages
    const totalDocuments = await this.collegeModal.countDocuments(query).exec();

    return {
      colleges,
      totalDocuments,
    };
  }

  async findOneCollege(id: string) {
    const college = await this.collegeModal.findById(id);
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college;
  }

  async updateCollegeById(
    id: string,
    updateCollegeDto: UpdateCollegeDto,
    authorization: string,
  ) {
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo(
      authorization,
    );

    const existingCollege = await this.collegeModal.findByIdAndUpdate(
      id,
      { ...updateCollegeDto, ...updatedInfo },
      { new: true },
    );
    if (!existingCollege) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return existingCollege;
  }

  async removeCollegeById(id: string) {
    const college = await this.collegeModal.findByIdAndDelete(id);
    const collegeCourse = await this.courseService.findOneCourseByQuery({
      collegeId: id,
    });

    if (collegeCourse) {
      await this.courseService.removeCourseByCollegeId(id);
    }
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college;
  }
}
