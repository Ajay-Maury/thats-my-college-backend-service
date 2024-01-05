import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCallbackRequestDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  @IsString()
  @IsOptional()
  timeStamp: string;
}
