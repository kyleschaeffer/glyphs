export enum LogLevel {
  Info = 1,
  Warn = 2,
  Error = 3,
  Quiet = 99,
}

export type Tags = { [key: string]: unknown }

export type ErrorLogMessage = {
  cause?: Error | string
  level: LogLevel.Error
  message: string
  tags?: Tags
}

export type InfoLogMessage = {
  level: LogLevel.Info
  message: string
  tags?: Tags
}

export type WarnLogMessage = {
  level: LogLevel.Warn
  message: string
  tags?: Tags
}

export type LogMessage = ErrorLogMessage | InfoLogMessage | WarnLogMessage

export type LogMessageOptions<T extends LogMessage> = Omit<T, 'level' | 'message'>

export type LoggerInterface = {
  log(message: LogMessage, logLevel: LogLevel): void
}

const ConsoleLoggerInterface: LoggerInterface = {
  log(message, logLevel) {
    if (logLevel > message.level) {
      return
    }

    const logData: any[] = [message.message]

    if (message.level === LogLevel.Error && message.cause) {
      logData.push({
        cause: message.cause instanceof Error ? message.cause.message : message.cause,
        tags: message.tags ?? {},
      })
    } else if (message.tags && Object.keys(message.tags).length) {
      logData.push({ tags: message.tags })
    }

    if (message.level === LogLevel.Info) {
      console.info(...logData)
    } else if (message.level === LogLevel.Warn) {
      console.warn(...logData)
    } else if (message.level === LogLevel.Error) {
      console.error(...logData)
    }
  },
}

/**
 * Logger utils
 */
export const log = {
  _logger: ConsoleLoggerInterface,
  _logLevel: LogLevel.Info,

  /**
   * Log an info message
   *
   * @param message Message
   * @param options Options
   */
  info(message: string, options: LogMessageOptions<InfoLogMessage> = {}): void {
    this._logger.log({ level: LogLevel.Info, message, ...options }, this._logLevel)
  },

  /**
   * Log a warning message
   *
   * @param message Message
   * @param options Options
   */
  warn(message: string, options: LogMessageOptions<InfoLogMessage> = {}): void {
    this._logger.log({ level: LogLevel.Warn, message, ...options }, this._logLevel)
  },

  /**
   * Log an error message
   *
   * @param message Message
   * @param options Options
   */
  error(message: string, options: LogMessageOptions<ErrorLogMessage> = {}): void {
    this._logger.log({ level: LogLevel.Error, message, ...options }, this._logLevel)
  },

  /**
   * Configure the active logger interface
   *
   * @param logger Logger
   */
  setLogger(logger: LoggerInterface): void {
    this._logger = logger
  },

  /**
   * Configure teh active log level; log messages below this level will be suppressed
   *
   * @param level Log level
   */
  setLogLevel(level: LogLevel): void {
    this._logLevel = level
  },
}
