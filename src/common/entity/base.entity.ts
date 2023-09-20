// src/schemas/base.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BaseEntity extends Document {
  @Prop({ type: String, default: () => new Date().toISOString() })
  createdAt: string;

  @Prop({ type: String, default: () => new Date().toISOString() })
  updatedAt: string;

  @Prop({ type: String })
  deletedAt: string;

  @Prop({ type: String })
  createdBy: string;

  @Prop({ type: String })
  updatedBy: string;

  @Prop({ type: String })
  deletedBy: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const BaseSchemaFactory = SchemaFactory.createForClass(BaseEntity);
