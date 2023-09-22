export const CONSTANTS = {
  APPLICATION_NAME: 'Thats My College Backend Service',
  APPLICATION_SHORT_NAME: 'thats-my-college-backend-service',
  GLOBAL_PREFIX: 'api',
};

export const SWAGGER_CONSTANTS = {
  TITLE: 'API',
  DESCRIPTION: 'Thats My College API description',
  VERSION: '1.0',
  PATH: 'api/doc',
  SWAGGER_AUTH_SECURITY_SCHEMA_API_KEY: 'api-config-key',
  SWAGGER_AUTH_SECURITY_SCHEMA_JWT: 'jwt',
};

export const LOGGER = {
  NAME: 'application',
};

export enum SWAGGER_TAGS {
  COLLEGE = 'college',
  COURSES = 'courses',
  USERS = 'users',
  AUTH = 'auth',
}
