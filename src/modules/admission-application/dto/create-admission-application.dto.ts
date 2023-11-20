import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AdmissionApplicationStatusEnum } from '../enums/admission-application.enums';

export class AdmissionApplicationDto {
  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsPhoneNumber('IN', { message: 'Invalid phone number format for India' })
  @IsNotEmpty()
  applicantMobile: string;

  @IsEmail()
  @IsNotEmpty()
  applicantEmail: string;

  @IsMongoId()
  @IsNotEmpty()
  collegeId: string;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsNotEmpty()
  interestedCourse: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  applicantCurrentCity?: string;
}

export class CreateAdmissionApplicationDto extends AdmissionApplicationDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEnum(AdmissionApplicationStatusEnum, { each: true })
  @IsNotEmpty()
  status: AdmissionApplicationStatusEnum =
    AdmissionApplicationStatusEnum.APPLIED;
}
