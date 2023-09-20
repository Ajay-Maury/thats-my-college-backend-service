/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */

import { Injectable } from '@nestjs/common';
// import { AuthService } from './path-to-auth-service'; // Update with the actual path to your AuthService

@Injectable()
export class EntityUtilsService {
  constructor() {} // private readonly authService: AuthService

  // public async getCurrentUser(): Promise<CurrentUser> {
  //   try {
  //     return await this.authService.getCurrentUser();
  //   } catch (error) {
  //     return {
  //       email: 'NA',
  //       firstName: 'NA',
  //       id: 'NA',
  //       lastName: 'NA',
  //       role: [],
  //     };
  //   }
  // }

  public async getCreatedInfo() {
    try {
      // const currentUser = await this.getCurrentUser();
      return {
        createdOn: new Date().toUTCString(),
        createdBy: 'NA',
        // createdBy: currentUser.id,
        updatedOn: new Date().toUTCString(),
        updatedBy: 'NA',
        // updatedBy: currentUser.id,
        isDeleted: false,
      };
    } catch (error) {
      return {
        createdOn: new Date().toUTCString(),
        createdBy: 'NA',
        isDeleted: false,
        updatedOn: new Date().toUTCString(),
        updatedBy: 'NA',
      };
    }
  }

  public async getUpdatedInfo() {
    try {
      // const currentUser = await this.getCurrentUser();
      return {
        updatedOn: new Date().toUTCString(),
        updatedBy: 'NA',
        // updatedBy: currentUser.id,
      };
    } catch (error) {
      return { updatedOn: new Date().toUTCString(), updatedBy: 'NA' };
    }
  }

  public async getDeletedInfo() {
    try {
      // const currentUser = await this.getCurrentUser();
      return {
        deletedOn: new Date().toUTCString(),
        deletedBy: 'NA',
        isDeleted: true,
        // deletedBy: currentUser.id,
      };
    } catch (error) {
      return {
        deletedOn: new Date().toUTCString(),
        deletedBy: 'NA',
        isDeleted: true,
      };
    }
  }
}
