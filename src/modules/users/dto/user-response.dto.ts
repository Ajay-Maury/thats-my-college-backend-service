import { GenderEnum, UserRoleEnum } from '../enums/users.enums';

export class UserResponseDto {
  readonly _id: string;
  readonly email: string;
  readonly phone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isDeleted: boolean;
  readonly role: UserRoleEnum;
  readonly gender: GenderEnum;
  readonly qualification: string;
}
