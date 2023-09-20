import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS, SWAGGER_CONSTANTS, SWAGGER_TAGS } from './utils/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerProvider } from './logger/logger.provider';

async function bootstrap() {
  // Create a Nest.js application instance
  const app = await NestFactory.create(AppModule);

  // Retrieve the configuration service for environment variables
  const configService = app.get<ConfigService>(ConfigService);

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();

  // Adding bunyan for logs
  app.useLogger(new LoggerProvider().Get());

  // Set a global API prefix (e.g., '/api')
  app.setGlobalPrefix(CONSTANTS.GLOBAL_PREFIX);

  // Configure a global validation pipe with options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //  Remove unexpected properties from DTOs
      transform: true, //  Automatically transform incoming data types
      forbidNonWhitelisted: true, //  Reject requests with non-whitelisted properties
      transformOptions: {
        //  Additional transformation options
        enableImplicitConversion: true, //    - Enable implicit type conversion
      },
    }),
  );

  // Configure Swagger for API documentation
  const swaggerConfig = new DocumentBuilder()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-thats-my-college-api-config-key',
        in: 'header',
      },
      SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY, // API key security scheme name
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT, // Bearer token security scheme name
    )
    .setTitle(SWAGGER_CONSTANTS.TITLE)
    .setDescription(SWAGGER_CONSTANTS.DESCRIPTION)
    .setVersion(SWAGGER_CONSTANTS.VERSION)
    .addTag(SWAGGER_TAGS.COLLEGE) //  Add a tag for API grouping

    .build();

  // Create the Swagger document
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // Setup Swagger UI endpoint for API documentation
  SwaggerModule.setup(SWAGGER_CONSTANTS.PATH, app, swaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha', //  Sort tags alphabetically
      operationsSorter: 'alpha', //  Sort operations alphabetically within tags
      docExpansion: 'none', //  Collapse all documentation sections by default
    },
  });

  // Start the application and listen on the specified port (fallback to 4000 if not provided)
  await app.listen(configService.get('PORT') || 4000);
}

// Bootstrap the Nest.js application
bootstrap();
