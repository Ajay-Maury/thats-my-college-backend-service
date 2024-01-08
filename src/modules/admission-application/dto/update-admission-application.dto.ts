import { PartialType } from '@nestjs/swagger';
import { CreateAdmissionApplicationDto } from './create-admission-application.dto';
import { AdmissionApplicationStatusEnum } from '../enums/admission-application.enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAdmissionApplicationDto extends PartialType(
  CreateAdmissionApplicationDto,
) {}

export class UpdateApplicationStatusDto {
  @IsEnum(AdmissionApplicationStatusEnum, { each: true })
  @IsNotEmpty()
  status: AdmissionApplicationStatusEnum;
}
