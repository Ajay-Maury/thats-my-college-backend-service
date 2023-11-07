import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../enums/users.enums';
import { CreateUserFormDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserFormDto) {}

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRoleEnum, { each: true })
  role: UserRoleEnum;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}
