import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseEntity } from 'src/common/entity/base.entity';
import { College } from 'src/modules/college/entities/college.entity';
import { Course } from 'src/modules/courses/entities/course.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AdmissionApplicationStatusEnum } from '../enums/admission-application.enums';

@Schema({ collection: 'admission-applications' })
export class AdmissionApplication extends BaseEntity {
  @Prop({ type: String, required: true })
  applicantName: string;

  @Prop({ type: String, required: true })
  applicantMobile: string;

  @Prop({ type: String, required: true })
  applicantEmail: string;

  @Prop({ type: String, required: true })
  interestedCourse: string;

  @Prop({ type: String, required: false })
  applicantCurrentCity?: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: string;

  @Prop({ type: Types.ObjectId, required: true, ref: College.name })
  collegeId: College;

  @Prop({ type: Types.ObjectId, required: false, ref: Course.name })
  courseId?: Course;

  @Prop({ type: String, required: true, enum: AdmissionApplicationStatusEnum })
  status: AdmissionApplicationStatusEnum;
}

export const AdmissionApplicationSchema =
  SchemaFactory.createForClass(AdmissionApplication);
