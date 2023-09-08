import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class DatabaseConfig implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {
    // Inject the ConfigService, which allows us to access configuration values
  }

  createMongooseOptions(): MongooseModuleOptions {
    // This method is required by MongooseOptionsFactory to create Mongoose configuration options

    return {
      uri: this.configService.get<string>('MONGODB_URI'), // Get the MongoDB URI from the configuration
    };
  }
}
