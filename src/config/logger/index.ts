/* istanbul ignore file */
/* eslint-disable implicit-arrow-linebreak */
import winston from 'winston';
import fs from 'fs';
import Env from '../../utils/env';
import rootPath from 'app-root-path';

const { combine, label, timestamp, colorize, printf } = winston.format;

/**
 * getLogToProcess - gets log of process
 * @param {env} env env variables
 * @param {fileOpt} fileOpt file options
 * @param {consoleOpt} consoleOpt console options
 * @returns {Array} - Array of all log processess
 */
const getLogToProcess = (env: any, fileOpt: any, consoleOpt: any) => {
  const array = [];
  if (env === 'test') {
    array.push(
      new winston.transports.File(fileOpt),
      new winston.transports.Console(consoleOpt),
    );
    return array;
  }

  array.push(
    new winston.transports.File(fileOpt),
    new winston.transports.Console(consoleOpt),
  );
  return array;
};

/**
 * @Class Logger class
 * Defines all the necessary attributes and properties of
 * all log information
 */
class App_Logger {
  private logDir: any;
  private label: any;
  private _commonOptions: any;
  private debugMode: any;
  private environment: any;
  constructor(options: any) {
    this.logDir = options.logDirPath || `${rootPath}/logs`;
    this.label = options.label || 'log';
    this._commonOptions = {
      console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(
          colorize({ all: true }),
          printf(
            (msg) =>
              `[${new Date(msg.timestamp).toUTCString()}]: ${msg.label} : - ${
                msg.level
              }: ${msg.message}`,
          ),
        ),
      },
      file: {
        level: 'debug',
        filename: `${this.logDir}/app.log`,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 2000,
        format: winston.format.json(),
      },
    };
    this.debugMode =
      options.debugMode === true || options.debugMode === undefined;
    this.environment = Env.get<string>('NODE_ENV') || 'development';
  }

  /**
   * _getTransport - private get transport method
   * @returns getLogToProcess, fileOptions, consoleOptions
   * @memberof Logger
   * @private
   */
  _getTransports() {
    const { console, file } = this._commonOptions;
    let level = this.debugMode ? 'debug' : 'info';
    if (this.environment === 'production' && this.debugMode) level = 'error';
    const consoleOpt = { ...console, level };
    const fileOpt = {
      ...file,
      filename: `${this.logDir}/app.${this.environment}.log`,
    };
    return getLogToProcess(
      Env.get<string>('PAPERTRAIL_PORT'),
      fileOpt,
      consoleOpt,
    );
  }

  /**
   * init - initializes a logger class
   * @returns Logger instance
   * @private
   * @memberof Logger
   */
  init() {
    if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir);
    const logger: any = winston.createLogger({
      format: combine(
        timestamp(),
        label({
          label: this.label,
        }),
      ),
      transports: this._getTransports(),
      exitOnError: false,
    });
    logger.stream = {
      write(message: any) {
        logger.info(message);
      },
    };
    return logger;
  }

  /**
   * createLogger - creates a logger
   * @param {options} options - options needed for creating logger
   * @returns A new instance of logger
   * @memberof Logger
   * @public
   */
  static createLogger(options: any) {
    const loggerInstance = new App_Logger(options);
    return loggerInstance.init();
  }
}

const Logger = App_Logger.createLogger({ label: 'CARDUVY_V1' });
export default Logger;
