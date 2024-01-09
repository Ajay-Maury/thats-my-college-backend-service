import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as os from 'os';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    const startMemoryUsage = os.freemem();
    const startCpuUsage = process.cpuUsage();
    const startTime = process.hrtime();

    res.once('finish', async () => {
      const { statusCode } = res;

      // Memory Usage Calculation
      const endMemoryUsage = os.freemem();
      const totalMemory = os.totalmem();
      const memoryUsedPercentage =
        ((startMemoryUsage - endMemoryUsage) / totalMemory) * 100;

      // CPU Usage Calculation using os
      const endCpuUsage = process.cpuUsage(startCpuUsage);
      const cpuTime = (endCpuUsage.user + endCpuUsage.system) / 1000000; // Convert to seconds
      const cpuUsagePercentage = (cpuTime / os.cpus().length) * 100;

      // Response Time Calculation
      const endTime = process.hrtime(startTime);
      const elapsedTimeInSeconds = endTime[0] + endTime[1] / 1e9;

      this.logger.log({
        message: 'Request and Response Metrics',
        method,
        url: originalUrl,
        userAgent,
        ip,
        statusCode,
        responseTime: `${elapsedTimeInSeconds.toFixed(2)} seconds`,
        cpuUsage: `${cpuUsagePercentage.toFixed(2)}%`,
        memoryUsage: `${memoryUsedPercentage.toFixed(2)}%`,
      });
    });

    next();
  }
}
