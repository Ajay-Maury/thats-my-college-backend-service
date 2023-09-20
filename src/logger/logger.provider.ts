import { LoggerService } from '@nestjs/common';
import * as Bunyan from 'bunyan';
import { LOGGER } from 'src/utils/constants';
import { BunyanLoggerService } from './bunyanLogger.service';

export class LoggerProvider {
  Get(): LoggerService {
    const bunyanLogger = Bunyan.createLogger({
      name: LOGGER.NAME,
      level: Bunyan.DEBUG,
    });
    return new BunyanLoggerService(bunyanLogger);
  }
}
