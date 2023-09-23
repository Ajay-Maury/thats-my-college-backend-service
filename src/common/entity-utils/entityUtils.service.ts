import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.services';
import {
  ICreatedInfo,
  IDeletedInfo,
  IUpdatedInfo,
} from './entityUtils.interface';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

@Injectable()
export class EntityUtilsService {
  constructor(private readonly authService: AuthService) {} // Inject the AuthService to handle user authentication.

  // Retrieve the current user's information based on the provided authorization token.
  public async getCurrentUser(token: string): Promise<UserResponseDto> {
    // Call AuthService to get user details from the provided token.
    return await this.authService.getUserFromToken(token);
  }

  // Create and return information about when and by whom an entity was created.
  public async getCreatedInfo(authorization = ''): Promise<ICreatedInfo> {
    try {
      const currentUser = await this.getCurrentUser(authorization);
      // Return created info with current timestamp and user details.
      return {
        createdOn: new Date().toUTCString(),
        createdBy: currentUser._id,
        updatedOn: new Date().toUTCString(),
        updatedBy: currentUser._id,
        isDeleted: false,
      };
    } catch (error) {
      // If an error occurs, return default values.
      return {
        createdOn: new Date().toUTCString(),
        createdBy: 'NA',
        isDeleted: false,
        updatedOn: new Date().toUTCString(),
        updatedBy: 'NA',
      };
    }
  }

  // Create and return information about when and by whom an entity was updated.
  public async getUpdatedInfo(authorization = ''): Promise<IUpdatedInfo> {
    try {
      const currentUser = await this.getCurrentUser(authorization);

      // Return updated info with current timestamp and user details.
      return {
        updatedOn: new Date().toUTCString(),
        updatedBy: currentUser._id,
      };
    } catch (error) {
      // If an error occurs, return default values.
      return { updatedOn: new Date().toUTCString(), updatedBy: 'NA' };
    }
  }

  // Create and return information about when and by whom an entity was deleted.
  public async getDeletedInfo(authorization = ''): Promise<IDeletedInfo> {
    try {
      const currentUser = await this.getCurrentUser(authorization);

      // Return deleted info with current timestamp, user details, and isDeleted flag.
      return {
        deletedOn: new Date().toUTCString(),
        isDeleted: true,
        deletedBy: currentUser._id,
      };
    } catch (error) {
      // If an error occurs, return default values.
      return {
        deletedOn: new Date().toUTCString(),
        deletedBy: 'NA',
        isDeleted: true,
      };
    }
  }
}
