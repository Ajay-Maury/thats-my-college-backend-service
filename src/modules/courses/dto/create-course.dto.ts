import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CourseDto{
    @IsNotEmpty()
    @IsString()
    courseName : string;

    @IsNotEmpty()
    @IsString()
    fee : string;

    @IsNotEmpty()
    @IsString()
    eligibility : string;

    @IsNotEmpty()
    @IsString()
    duration : string;

}

export class CreateCourseDto {
    @IsNotEmpty()
    @IsMongoId()
    collegeId : string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true }) // Use ValidateNested decorator to validate each item in the array
    @Type(() => CourseDto) // Specify the type for validation
    courses: CourseDto[]
}
