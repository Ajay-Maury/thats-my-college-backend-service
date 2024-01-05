import { Module } from '@nestjs/common';
import { CallbackRequestsService } from './callback-requests.service';
import { CallbackRequestsController } from './callback-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CallbackRequest,
  CallbackRequestSchema,
} from './entities/callback-request.entity';

@Module({
  imports: [
    // Import the MongooseModule for the CallbackRequest entity.
    MongooseModule.forFeature([
      { name: CallbackRequest.name, schema: CallbackRequestSchema }, // Define the feature with the schema
    ]),
  ],
  controllers: [CallbackRequestsController],
  providers: [CallbackRequestsService],
})
export class CallbackRequestsModule {}
