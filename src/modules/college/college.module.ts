import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { College, CollegeSchema } from './schemas/college.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: College.name, schema: CollegeSchema }, // Define the feature with the schema
    ]),
    // HttpModule,
  ],
  controllers: [CollegeController],
  providers: [CollegeService],
  exports: [CollegeService],
})
export class CollegeModule {}
