import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';

@Module({
  imports: [
    // Import the MongooseModule for the Course entity.
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema }, // Define the feature with the schema
    ]),
  ],
  controllers: [CoursesController], // Register the CoursesController for handling HTTP requests.
  providers: [CoursesService], // Register the CoursesService to provide business logic.
  exports: [CoursesService], // Export the CoursesService for use in other modules.
})
export class CoursesModule {}
