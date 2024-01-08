import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const startTime = moment();
    const startUsage = process.cpuUsage();
    const startMemoryUsage = process.memoryUsage();

    response.on('finish', () => {
      const { statusCode } = response;
      const endTime = moment();
      // Calculate time taken by api
      const elapsedTimeInSeconds = endTime.diff(startTime, 'seconds', true);
      // Calculate CPU usage percentage
      const endUsage = process.cpuUsage(startUsage);
      const cpuUsagePercent =
        (endUsage.user + endUsage.system) / 1000 / elapsedTimeInSeconds;

      // Calculate memory usage percentage
      const endMemoryUsage = process.memoryUsage();
      const memoryUsage =
        (endMemoryUsage.heapUsed - startMemoryUsage.heapUsed) / (1024 * 1024);
      this.logger.log(`
        \nREQUEST INFO:
          - Method: ${method}
          - URL: ${originalUrl}
          - User Agent: ${userAgent}
          - IP: ${ip}
        \nRESPONSE INFO:
          - Status Code: ${statusCode}
          - Response Time: ${elapsedTimeInSeconds.toFixed(2)} seconds
          - CPU Usage: ${cpuUsagePercent.toFixed(2)}%
          - Memory Usage: ${memoryUsage.toFixed(2)} MB
      `);
    });
    next();
  }
}
