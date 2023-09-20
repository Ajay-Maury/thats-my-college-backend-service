import { LoggerService } from '@nestjs/common';
import * as Bunyan from 'bunyan';
import chalk from 'chalk'; // Import chalk for color formatting
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
    const coloredMessage = chalk.green(message); // Green for log messages
    this._logger.info(coloredMessage, optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    const coloredMessage = chalk.red(message); // Red for error messages
    this._logger.error(coloredMessage, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    const coloredMessage = chalk.yellow(message); // Yellow for warnings
    this._logger.warn(coloredMessage, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    const coloredMessage = chalk.blue(message); // Blue for debug messages
    this._logger.debug(coloredMessage, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    const coloredMessage = chalk.gray(message); // Gray for verbose messages
    this._logger.debug(coloredMessage, optionalParams);
  }
}
