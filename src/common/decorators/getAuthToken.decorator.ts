// Import necessary modules from NestJS
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Create a custom decorator called GetAuthToken
export const GetAuthToken = createParamDecorator(
  // The decorator function takes two parameters:
  // - data: any (This parameter can be used to pass additional data to the decorator, if needed)
  // - ctx: ExecutionContext (This parameter provides context information about the current request)

  // The decorator function returns a string, which is the authorization token.
  (data: string, ctx: ExecutionContext): string => {
    // Get the request object from the context
    const request = ctx.switchToHttp().getRequest();

    // Get the 'authorization' header from the request
    const authorization = request.headers.authorization;

    // Check if the 'authorization' header exists
    // Split the 'authorization' header value using a space
    //return the second part, which is typically the token (e.g., "Bearer your-token")
    // If the 'authorization' header is missing, return null

    return authorization ? authorization.split(' ')[1] : null;
  },
);
