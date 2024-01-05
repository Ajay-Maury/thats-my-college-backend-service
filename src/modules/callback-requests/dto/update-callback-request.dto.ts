import { PartialType } from '@nestjs/mapped-types';
import { CreateCallbackRequestDto } from './create-callback-request.dto';

export class UpdateCallbackRequestDto extends PartialType(
  CreateCallbackRequestDto,
) {}
