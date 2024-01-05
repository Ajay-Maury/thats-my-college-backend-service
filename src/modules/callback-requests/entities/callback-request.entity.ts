import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { BaseEntity } from 'src/common/entity/base.entity';
import { CONFIG } from 'src/config/config';

@Schema({ collection: 'callbackRequests' })
export class CallbackRequest extends BaseEntity {
  @Prop({ type: String, required: true, ref: 'User' }) // Reference to User model
  userId: string;

  @Prop({ required: true, type: Date, default: Date.now() })
  createdAt: string;

  @Prop({
    required: true,
    type: Date,
    default: moment().add(CONFIG.CALLBACK_REQUEST_EXPIRY_HOURS, 'h').toDate(),
  })
  expireAt: Date;
}

export const CallbackRequestSchema =
  SchemaFactory.createForClass(CallbackRequest);

// Set the TTL index on the "createdAt" field
CallbackRequestSchema.index(
  { createdAt: 1 },
  { expires: `${CONFIG.CALLBACK_REQUEST_EXPIRY_HOURS}h` },
);
