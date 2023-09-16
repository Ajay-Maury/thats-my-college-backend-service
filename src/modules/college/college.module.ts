import { Module } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { College, CollegeSchema } from './entities/college.entity';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    // Import the MongooseModule for the College entity.
    MongooseModule.forFeature([
      { name: College.name, schema: CollegeSchema }, // Define the feature with the schema
    ]),
    // Import the CoursesModule to make its functionality available within this module.
    CoursesModule,
  ],
  controllers: [CollegeController], // Register the CollegeController for handling HTTP requests.
  providers: [CollegeService], // Register the CollegeService to provide business logic.
  exports: [CollegeService], // Export the CollegeService for use in other modules.
})
export class CollegeModule {}
