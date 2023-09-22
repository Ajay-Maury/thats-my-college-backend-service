import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { EntityUtilsService } from 'src/common/entity-utils/entityUtils.service';

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
