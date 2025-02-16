import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';
import { College } from '../college/entities/college.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import {
  UpdateAdmissionApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/update-admission-application.dto';
import { AdmissionApplication } from './entities/admission-application.entity';
import { AdmissionApplicationStatusEnum } from './enums/admission-application.enums';

@Injectable()
export class AdmissionApplicationService {
  constructor(
    @InjectModel(AdmissionApplication.name)
    private admissionApplicationModule = Model<AdmissionApplication>,
    // @Inject(forwardRef(() => EntityUtilsService))
    private readonly entityUtilsService: EntityUtilsService, // Injects the EntityUtilsService.
  ) {}

  // Helper method to check if the provided ID exists in the specified collection
  private async checkIfIdExists(
    id: string,
    collectionName: string,
  ): Promise<boolean> {
    const model = this.admissionApplicationModule.db.model(collectionName);
    const existingDocument = await model.findById(id);

    return !!existingDocument; // !! is a shorthand way of converting the existingDocument value into a boolean.
  }

  // Helper method to check if the provided ID in payload exists
  public async checkPayloadIds(payload: any) {
    // Check if the provided userId exists
    if (payload.userId) {
      const userExists = await this.checkIfIdExists(payload.userId, User.name);
      if (!userExists) {
        throw new NotFoundException(
          `User with Id #${payload.userId} not found`,
        );
      }
    }

    // Check if the provided collegeId exists
    if (payload.collegeId) {
      const collegeExists = await this.checkIfIdExists(
        payload.collegeId,
        College.name,
      );
      if (!collegeExists) {
        throw new NotFoundException(
          `College with Id #${payload.collegeId} not found`,
        );
      }
    }

    // Check if the provided courseId exists
    if (payload.courseId) {
      const courseExists = await this.checkIfIdExists(
        payload.courseId,
        Course.name,
      );
      if (!courseExists) {
        throw new NotFoundException(
          `Course with Id #${payload.courseId} not found`,
        );
      }
    }
  }

  public async create(
    createAdmissionApplicationDto: CreateAdmissionApplicationDto,
    userId: string,
  ) {
    await this.checkPayloadIds(createAdmissionApplicationDto);

    const createdInfo = await this.entityUtilsService.getCreatedInfo(userId);

    return await this.admissionApplicationModule.create({
      ...createAdmissionApplicationDto,
      userId,
      status: AdmissionApplicationStatusEnum.APPLIED,
      ...createdInfo,
    });
  }

  public async findAll() {
    const applications = await this.admissionApplicationModule
      .find()
      .populate('collegeId');
    const totalDocuments =
      await this.admissionApplicationModule.countDocuments();

    return { applications, totalDocuments };
  }

  public async findOne(id: string) {
    const application = await this.admissionApplicationModule
      .findById(id)
      .populate('collegeId');

    if (!application)
      throw new NotFoundException(
        `Admission application with id #${id} not found`,
      );

    return application;
  }

  public async findAllAdmissionApplicationByUserId(userId: string) {
    const applications = await this.admissionApplicationModule
      .find({ userId })
      .populate('collegeId');

    const totalDocuments = await this.admissionApplicationModule.countDocuments(
      {
        userId,
      },
    );

    return { applications, totalDocuments };
  }

  public async update(
    id: string,
    updateAdmissionApplicationDto: UpdateAdmissionApplicationDto,
    userId: string,
  ) {
    await this.checkPayloadIds(updateAdmissionApplicationDto);

    const updatedInfo = await this.entityUtilsService.getUpdatedInfo(userId);
    const updatedApplication =
      await this.admissionApplicationModule.findByIdAndUpdate(
        id,
        {
          ...updateAdmissionApplicationDto,
          ...updatedInfo,
        },
        { new: true },
      );

    if (!updatedApplication)
      throw new NotFoundException(
        `Admission application with id #${id} not found`,
      );

    return updatedApplication;
  }

  public async updateAdmissionApplicationStatus(
    id: string,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
    userId: string,
  ) {
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo(userId);
    const updatedApplication =
      await this.admissionApplicationModule.findByIdAndUpdate(
        id,
        {
          ...updateApplicationStatusDto,
          ...updatedInfo,
        },
        { new: true },
      );

    if (!updatedApplication)
      throw new NotFoundException(
        `Admission application with id #${id} not found`,
      );

    return updatedApplication;
  }

  public async remove(id: string, userId: string) {
    const application = await this.admissionApplicationModule.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!application)
      throw new NotFoundException(
        `Admission application with id #${id} not found for user with id #${userId}`,
      );

    return application;
  }
}
