import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database/database.module'; // Fixed the typo here
import { CollegeModule } from './modules/college/college.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EntityUtilsModule } from './common/entity-utils/entityUtils.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdmissionApplicationModule } from './modules/admission-application/admission-application.module';
import { CallbackRequestsModule } from './modules/callback-requests/callback-requests.module';
import { PerformanceMiddleware } from './middlewares/request.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Configure global environment variables
      isGlobal: true, // Make the configuration available globally
    }),
    AuthModule,
    EntityUtilsModule, // Import the EntityUtilsModule for entity utils services
    DatabaseModule, // Import the DatabaseModule for database connectivity
    CollegeModule, // Import the CollegeModule for your college-related functionality
    CoursesModule,
    UsersModule,
    AdmissionApplicationModule,
    CallbackRequestsModule,
  ],
  controllers: [AppController], // Define controllers for handling HTTP requests
  providers: [AppService], // Define application-level services
})
export class AppModule {
  // Configure middleware for the application
  configure(consumer: MiddlewareConsumer) {
    // Apply the PerformanceMiddleware to all routes ('*')
    consumer.apply(PerformanceMiddleware).forRoutes('*');
  }
} // AppModule is the root module of your Nest.js application
