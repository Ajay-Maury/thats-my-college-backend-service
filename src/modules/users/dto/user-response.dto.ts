import { GenderEnum, UserRoleEnum } from '../../../utils/enums/users.enums';

export class UserResponseDto {
  readonly _id: string;
  readonly email: string;
  readonly phone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isDeleted: boolean;
  readonly gender: GenderEnum;
  readonly qualification: string;
  readonly profilePictureUrl: string;
  readonly role: UserRoleEnum[];
}
