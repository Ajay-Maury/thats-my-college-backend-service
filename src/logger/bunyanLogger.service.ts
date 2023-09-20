import { LoggerService } from '@nestjs/common';
import * as Bunyan from 'bunyan';
import { CONSTANTS } from 'src/utils/constants';

export class BunyanLoggerService implements LoggerService {
  private readonly _logger: Bunyan;

  constructor(logger: Bunyan) {
    this._logger = logger.child({
      component: CONSTANTS.APPLICATION_SHORT_NAME,
    });
    this._logger.addSerializers(Bunyan.stdSerializers);
  }

  log(message: any, ...optionalParams: any[]) {
    this._logger.info(message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this._logger.error(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this._logger.warn(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this._logger.debug(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this._logger.debug(message, optionalParams);
  }
}
