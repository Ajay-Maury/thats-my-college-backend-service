import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CONFIG } from 'src/config/config';
import { CallbackRequest } from './entities/callback-request.entity';

@Injectable()
export class CallbackRequestsService {
  constructor(
    @InjectModel(CallbackRequest.name)
    private callbackRequestModel: Model<CallbackRequest>,
  ) {}
  async create(userId: string) {
    const callbackRequestLimit = CONFIG.CALLBACK_REQUEST_LIMIT;
    const existingRequestsCount =
      await this.callbackRequestModel.countDocuments({ userId });
    if (existingRequestsCount >= callbackRequestLimit) {
      return {
        message: `${existingRequestsCount} callback request already exists`,
        isCallbackRequestExists: true,
      };
    }
    const callbackREquest = await this.callbackRequestModel.create({ userId });
    return {
      message: `Callback request placed successfully`,
      isCallbackRequestExists: false,
      data: callbackREquest,
    };
  }

  async getByUserId(userId: string) {
    const requests = await this.callbackRequestModel.find({ userId });
    if (!requests || requests.length === 0) {
      throw new NotFoundException(
        `Request not found for user with id:- #${userId}`,
      );
    }
    return await this.callbackRequestModel.find({ userId });
  }

  async remove(userId: string) {
    const requests = await this.callbackRequestModel.find({ userId });
    if (!requests || requests.length === 0) {
      throw new NotFoundException(
        `Request not found for user with id:- #${userId}`,
      );
    }
    return await this.callbackRequestModel.deleteMany({ userId });
  }
}
