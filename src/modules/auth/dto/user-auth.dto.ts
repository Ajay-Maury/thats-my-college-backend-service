import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthenticateUserDto {
  // Validate that the password property is not empty and is a strong password.
  // A strong password should have a minimum length of 8 characters,
  // at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  password: string;

  // Validate that the email property is not empty and is in a valid email format.
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}

export class UserAuthTokenResponse {
  authToken: string;
  message: string;
  status: boolean;
}
