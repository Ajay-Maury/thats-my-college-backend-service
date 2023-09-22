import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { AuthenticateUserDto } from './dto/user-auth.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Inject the UsersService to interact with user data.
    private readonly jwtService: JwtService, // Inject the JwtService for JWT operations.
  ) {}

  // Validate a user by their userId.
  public async validateUser(userId: string) {
    const user = await this.usersService.findOneUserById(userId);

    // If the user is not found, throw an UnauthorizedException.
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // Return the user if found.
  }

  // Authenticate a user with email and password.
  public async authenticateUser(authenticateUserDto: AuthenticateUserDto) {
    const { email, password } = authenticateUserDto;

    // Find the user by email.
    const user = await this.usersService.findOneByEmail(email);

    // If no user with the provided email is found, throw an UnauthorizedException.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided password with the hashed password in the database.
    const passwordMatch = await compare(password, user.password);

    // If the passwords don't match, throw an UnauthorizedException.
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token with user information and return it.
    const payload = { id: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Get user details from a JWT token.
  public async getUserFromToken(token: string): Promise<UserResponseDto> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.validateUser(decoded.id); // validate the decoded token (user details)
      return user; // Return the user details.
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // Throw an exception if the token is invalid.
    }
  }
}
