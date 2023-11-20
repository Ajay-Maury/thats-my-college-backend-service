import { PartialType } from '@nestjs/swagger';
import { AdmissionApplicationDto } from './create-admission-application.dto';
import { AdmissionApplicationStatusEnum } from '../enums/admission-application.enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAdmissionApplicationDto extends PartialType(
  AdmissionApplicationDto,
) {}

export class UpdateApplicationStatusDto {
  @IsEnum(AdmissionApplicationStatusEnum, { each: true })
  @IsNotEmpty()
  status: AdmissionApplicationStatusEnum;
}
