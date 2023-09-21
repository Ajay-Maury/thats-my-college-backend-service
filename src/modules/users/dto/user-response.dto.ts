export class UserResponseDto {
  readonly email: string;
  readonly phone: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly _id: string;
}

export class UserAuthTokenResponse {
  authToken: string;
}
