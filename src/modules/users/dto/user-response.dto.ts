import { UserRoleEnum } from '../enums/users.enums';

export class UserResponseDto {
  readonly email: string;
  readonly phone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly _id: string;
  readonly isDeleted: boolean;
  readonly role: UserRoleEnum;
}
