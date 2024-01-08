import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/entity/base.entity';
import { GenderEnum, UserRoleEnum } from 'src/utils/enums/users.enums';

@Schema({ collection: 'users' })
export class User extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: false })
  lastName: string;

  @Prop({ type: String, required: false })
  profilePic: string;

  @Prop({ type: String, required: false })
  password: string;

  @Prop({ type: String, required: false })
  qualification: string;

  @Prop({
    required: true,
    type: [{ type: String, enum: UserRoleEnum }],
    default: [UserRoleEnum.USER],
  })
  role: UserRoleEnum[];

  @Prop({
    enum: GenderEnum,
    required: true,
    type: String,
  })
  gender: GenderEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
