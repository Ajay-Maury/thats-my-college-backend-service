import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class CollegeService {
  // The constructor of the service class where dependencies are injected.
  constructor(
    @InjectModel(College.name) // Injects the College model using its name.
    private collegeModal: Model<College>, // Represents the College model instance.
    private readonly courseService: CoursesService, // Injects the CoursesService.
  ) {}

  async createCollege(createCollegeDto: CreateCollegeDto) {
    return await this.collegeModal.create(createCollegeDto);
  }

  async findAllCollege() {
    return await this.collegeModal.find();
  }

  async findOneCollege(id: string) {
    const college = await this.collegeModal.findById(id);
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college;
  }

  async updateCollegeById(id: string, updateCollegeDto: UpdateCollegeDto) {
    const existingCollege = await this.collegeModal.findByIdAndUpdate(
      id,
      updateCollegeDto,
      { new: true },
    );
    if (!existingCollege) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return existingCollege;
  }

  async removeCollegeById(id: string) {
    const college = await this.collegeModal.findByIdAndDelete(id);
    const collegeCourse = await this.courseService.findCourseByCollegeId(id);
    if (collegeCourse) {
      await this.courseService.removeCourseByCollegeId(id);
    }
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college;
  }
}
