import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdmissionApplicationController } from './admission-application.controller';
import { AdmissionApplicationService } from './admission-application.service';
import {
  AdmissionApplication,
  AdmissionApplicationSchema,
} from './entities/admission-application.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdmissionApplication.name, schema: AdmissionApplicationSchema },
    ]),
  ],
  controllers: [AdmissionApplicationController],
  providers: [AdmissionApplicationService],
  exports: [AdmissionApplicationService],
})
export class AdmissionApplicationModule {}
