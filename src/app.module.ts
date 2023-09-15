import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module'; // Fixed the typo here
import { CollegeModule } from './modules/college/college.module';
import { CoursesModule } from './modules/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Configure global environment variables
      isGlobal: true, // Make the configuration available globally
    }),
    DatabaseModule, // Import the DatabaseModule for database connectivity
    CollegeModule, // Import the CollegeModule for your college-related functionality
    CoursesModule,
  ],
  controllers: [AppController], // Define controllers for handling HTTP requests
  providers: [AppService], // Define application-level services
})
export class AppModule {} // AppModule is the root module of your Nest.js application
