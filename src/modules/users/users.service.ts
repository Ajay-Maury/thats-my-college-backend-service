import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';
import { CreateUserDto, CreateUserFormDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.services';

@Injectable()
export class UsersService {
  // Constructor for UsersService class
  // It takes an injected MongoDB model for the 'User' entity
  // and assigns it to the private 'userModel' property.
  constructor(
    @InjectModel(User.name) // Inject the 'User' model based on its name
    private userModel = Model<User>, // Initialize 'userModel' with the injected model
    @Inject(forwardRef(() => EntityUtilsService))
    private readonly entityUtilsService: EntityUtilsService, // Injects the EntityUtilsService.
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService, // Injects the EntityUtilsService.
  ) {}

  // Create a new user with password hashing
  public async createUser(createUserDto: CreateUserFormDto) {
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

    //generate jwt token
    const authToken = this.authService.generateJwtToken(user);
    // return userObject with jwt token
    return { ...userResponse, authToken };
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

  // Find a user by their email (including the password field)
  public async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return user.toObject();
  }

  // Update a user by their Id
  public async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    // Get updated info from entity util service
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo();
    // Find and update the user by Id
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, ...updatedInfo },
      { new: true, select: '-password' },
    );

    if (!updatedUser)
      throw new NotFoundException(`User with user id #${id} not found`);

    return updatedUser;
  }

  // Update a user password
  public async updateUserPassword(
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const { email, password } = updateUserPasswordDto;

    const user = await this.getUserByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 12);

    // Get updated info from entity util service
    const updatedInfo = await this.entityUtilsService.getUpdatedInfo();
    // Find and update the user by Id
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedPassword, ...updatedInfo },
      { new: true, select: '-password' },
    );

    return updatedUser;
  }

  // Remove a user by their ID
  public async removeUserById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user)
      throw new NotFoundException(`User with user id #${id} not found`);

    // Delete the user from the database
    return await this.userModel.findByIdAndDelete(id);
  }

  public async oauthLogin(userDto: CreateUserDto) {
    const user = await this.userModel.create(userDto);
    const userResponse = user.toObject();
    const authToken = this.authService.generateJwtToken(userResponse);
    return { ...userResponse, authToken };
  }

  public async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.userModel.findOneAndUpdate(
      { email: updateUserRoleDto.email },
      updateUserRoleDto,
      {
        new: true,
        select: '-password',
      },
    );

    if (!user)
      throw new NotFoundException(
        `user with email:- ${updateUserRoleDto.email} not found`,
      );

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }, { password: 0 });
    if (!user)
      throw new NotFoundException(`User with email:- ${email} not found`);
    const userResponse = user.toObject();
    const authToken = this.authService.generateJwtToken(userResponse);
    return { ...userResponse, authToken };
  }
}
