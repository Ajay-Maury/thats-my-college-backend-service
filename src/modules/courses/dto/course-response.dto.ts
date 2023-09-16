import { CollegeResponseData } from 'src/modules/college/dto/college-response.dto';

export class Course {
  readonly courseName: string;
  readonly fullName: string;
  readonly branches: string[];
  readonly fee: string;
  readonly eligibility: string;
  readonly duration: string;
}

export class CourseDataWithCollegeDetailsDto {
  readonly _id: string;
  readonly collegeId: CollegeResponseData;
  readonly courses: Course[];
}

export class CourseDataDto {
  readonly _id: string;
  readonly collegeId: string;
  readonly courses: Course[];
}

export class CourseResponseDto {
  status: boolean;
  data: CourseDataDto;
  message: string;
}

export class CourseResponseArrayDto {
  status: boolean;
  data: CourseDataDto[];
  message: string;
}
