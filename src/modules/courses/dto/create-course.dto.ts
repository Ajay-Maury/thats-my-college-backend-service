import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CollegeFilterDto } from 'src/modules/college/dto/create-college.dto';

export class CourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  fee: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  branches: string[];

  @IsNotEmpty()
  @IsString()
  eligibility: string;

  @IsNotEmpty()
  @IsString()
  duration: string;
}

export class CreateCourseDto {
  @IsNotEmpty()
  @IsMongoId()
  collegeId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Use ValidateNested decorator to validate each item in the array
  @Type(() => CourseDto) // Specify the type for validation
  courses: CourseDto[];
}

export class CourseFilterDto extends CollegeFilterDto {
  @IsOptional()
  @IsString()
  courseName?: string;
}
