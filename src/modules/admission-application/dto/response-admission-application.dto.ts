import { AdmissionApplicationStatusEnum } from '../enums/admission-application.enums';

export class AdmissionApplicationResponse {
  _id: string;
  userId: string;
  applicantName: string;
  applicantMobile: string;
  applicantEmail: string;
  collegeId: string;
  courseId?: string;
  interestedCourse: string;
  applicantCurrentCity?: string;
  status: AdmissionApplicationStatusEnum;
}

export class AdmissionApplicationResponseDto {
  status: boolean;
  data?: AdmissionApplicationResponse;
  message: string;
}

export class AdmissionApplicationArrayResponseDto {
  status: boolean;
  data?: {
    applications: AdmissionApplicationResponse[];
    totalDocuments: number;
  };
  message: string;
}
