import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { College } from './entities/college.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CollegeService {

  constructor(
    @InjectModel(College.name)
    private collegeModal: Model<College>,
  ) { }


  async createCollege(createCollegeDto: CreateCollegeDto) {
    return await this.collegeModal.create(createCollegeDto)
  }

  async findAllCollege() {
    return await this.collegeModal.find()
  }

  async findOneCollege(id: string) {
    const college = await this.collegeModal.findById(id)
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college
  }

  async updateCollegeById(id: string, updateCollegeDto: UpdateCollegeDto) {
    const existingCollege = await this.collegeModal.findByIdAndUpdate(id, updateCollegeDto, { new: true })
    if (!existingCollege) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return existingCollege
  }

  async removeCollegeById(id: string) {
    const college = await this.collegeModal.findByIdAndDelete(id)
    if (!college) {
      throw new NotFoundException(`College with id #${id} not found`);
    }
    return college
  }
}
