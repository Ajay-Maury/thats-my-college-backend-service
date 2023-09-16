import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateCollegeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray({ message: 'Contact should be an array' })
  @ArrayNotEmpty({ message: 'Contact array should not be empty' })
  @IsString({
    each: true,
    message: 'Each element in the contact array should be a string',
  })
  contact: string[];

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsArray({ message: 'collegeType should be an array' })
  @ArrayNotEmpty({ message: 'collegeType array should not be empty' })
  @IsString({
    each: true,
    message: 'Each element in the collegeType array should be a string',
  })
  collegeType: string[];

  @IsNumber()
  @IsNotEmpty()
  established: number;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @IsNotEmpty()
  logo: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  image: string[];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsBoolean()
  @IsNotEmpty()
  featured: false;
}
