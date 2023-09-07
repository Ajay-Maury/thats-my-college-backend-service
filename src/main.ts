import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CONSTANTS, SWAGGER_CONSTANTS } from './utils/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(CONSTANTS.GLOBAL_PREFIX);
  app.enableCors();

    // swagger config for APIs
    const config = new DocumentBuilder()
    .addApiKey(
      { type: 'apiKey', name: 'x-thats-my-college-api-config-key', in: 'header' },
      SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY, // The name of the API key security scheme for api key
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      SWAGGER_CONSTANTS.SWAGGER_AUTH_SECURITY_SCHEMA_JWT,  // The name of the API key security scheme for bearers token
    )
    .setTitle(SWAGGER_CONSTANTS.TITLE)
    .setDescription(SWAGGER_CONSTANTS.DESCRIPTION)
    .setVersion(SWAGGER_CONSTANTS.VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_CONSTANTS.PATH, app, document);

  await app.listen(configService.get('PORT') ?? 4000);
}
bootstrap();
