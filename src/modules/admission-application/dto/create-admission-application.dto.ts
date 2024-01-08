import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAdmissionApplicationDto {
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
