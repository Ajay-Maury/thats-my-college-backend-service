import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { GenderEnum, UserRoleEnum } from '../enums/users.enums';

export class UpdateUserDto {
  // Validate that the firstName property is not empty and is a string.
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  // Validate that the lastName property is not empty and is a string.
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  // Validate that the phone property is not empty and is a valid phone number format for India.
  @IsNotEmpty()
  @IsOptional()
  @IsPhoneNumber('IN', { message: 'Invalid phone number format for India' })
  phone?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profilePic?: string;

  @IsEnum(GenderEnum, { each: true })
  @IsOptional()
  @IsNotEmpty()
  gender?: GenderEnum;
}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRoleEnum, { each: true })
  role: UserRoleEnum;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  password: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
