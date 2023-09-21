import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthenticateUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  // Constructor for UsersService class
  // It takes an injected MongoDB model for the 'User' entity
  // and assigns it to the private 'userModel' property.
  private jwtSecretKey = this.configService.get<string>('JWT_SECRET');
  constructor(
    @InjectModel(User.name) // Inject the 'User' model based on its name
    private userModel = Model<User>, // Initialize 'userModel' with the injected model
    private readonly entityUtilsService: EntityUtilsService, // Injects the EntityUtilsService.
    private readonly configService: ConfigService, // Injects the ConfigService to read environment variables and values.
  ) {}

  // Create a new user with password hashing
  public async createUser(createUserDto: CreateUserDto) {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    // Get created info from entity util service
    const createdInfo = await this.entityUtilsService.getCreatedInfo();

    // Create a new user object with the hashed password
    const user = await this.userModel.create({
      ...createUserDto,
      ...createdInfo,
      password: hashedPassword,
    });

    // Omit the password field from the response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Return user object
    return userResponse;
  }

  public async authenticateUser(authenticateUserDto: AuthenticateUserDto) {
    const { email, password } = authenticateUserDto;
    // Find the user by email
    const user = await this.userModel.findOne({ email });

    // If no user with the provided email is found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If the passwords don't match, throw an UnauthorizedException
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a JWT token with user information
    const token = jwt.sign(
      { sub: user.id, email: user.email }, // Payload
      this.jwtSecretKey, // JWT secret key
      { expiresIn: '24h' }, // Set token expiration
    );

    // Return the JWT token
    return token;
  }

  // Find all users (excluding the password field)
  public async findAllUsers() {
    return await this.userModel.find({}, { password: 0 });
  }

  // Find a user by their ID (excluding the password field)
  public async findOneUserById(id: string) {
    const user = await this.userModel.findById(id, { password: 0 });

    if (!user)
      throw new NotFoundException(`User with user id #${id} not found`);

    return user;
  }

  // Update a user by their ID, with optional password hashing
  public async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      // Hash the new password before updating it in the database
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 12);
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }

    // Get updated info from entity util service
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo();
    // Find and update the user by ID
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, ...updatedInfo },
      { new: true },
    );

    if (!updatedUser)
      throw new NotFoundException(`User with user id #${id} not found`);

    // Omit the password field from the response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return userResponse;
  }

  // Remove a user by their ID
  public async removeUserById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user)
      throw new NotFoundException(`User with user id #${id} not found`);

    // Delete the user from the database
    return await this.userModel.findByIdAndDelete(id);
  }
}
