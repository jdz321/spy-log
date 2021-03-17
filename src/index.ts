/**
 * LogLevel.Log is identical to LogLevel.Info
 * @see https://developers.google.com/web/tools/chrome-devtools/console/reference#level
 */
export enum LogLevel {
  Verbose,
  Log,
  Info,
  Warning,
  Error,
}

export interface LogRecord {
  /**
   * stage of a log-record
   * @example
   * [namespace][stage]message
   */
  stage?: string
  /** messages to print */
  message: any[]
  level: LogLevel
  time: Date
}

export interface GroupRecord {
  /**
   * name of a log-group
   * @example
   * > [namespace]name
   * ····[stage]message in a group
   */
  name: string
  /**
   * except the group is initially collapsed when it's logged to the Console
   */
  collapsed: boolean
  /**
   * records in a log-group
   */
  records: RecordType[]
}

/**
 * Log-records stored in LogGroup.records
 */
export type RecordType = LogRecord | GroupRecord

const LOG_FN_MAP = {
  [LogLevel.Verbose]: 'debug',
  [LogLevel.Log]: 'log',
  [LogLevel.Info]: 'info',
  [LogLevel.Warning]: 'warn',
  [LogLevel.Error]: 'error',
} as const

function isGroup(record: RecordType): record is GroupRecord {
  return !!(record as GroupRecord).name
}

function getLogFn(this: typeof Log, level: LogLevel): (...data: any[]) => void {
  const { console } = this
  return console[LOG_FN_MAP[level]].bind(console)
}

export class Log {
  static console = console
  static getLogFn = getLogFn

  constructor(protected namespace: string) {}
  protected curStage?: string

  stage(str: string): this {
    this.curStage = str
    return this
  }

  debug(...args: any[]): void {
    this.print(args, LogLevel.Verbose)
  }

  log(...args: any[]): void {
    this.print(args, LogLevel.Log)
  }

  info(...args: any[]): void {
    this.print(args, LogLevel.Info)
  }

  warn(...args: any[]): void {
    this.print(args, LogLevel.Warning)
  }

  error(...args: any[]): void {
    this.print(args, LogLevel.Error)
  }

  print(message: any[], level: LogLevel, stage: string | undefined = this.curStage, inGroup?: boolean): void {
    const logFn = Log.getLogFn(level)
    const namespace = inGroup ? '' : `[${this.namespace}]`
    const stageStr = stage ? `[${stage}]` : ''
    logFn(`${namespace}${stageStr}`, ...message)
  }

  printGroup(name: string, records: RecordType[], collapsed: boolean): void {
    const namespace = `[${this.namespace}]`
    const stageStr = this.curStage ? `[${this.curStage}]` : ''
    console[collapsed ? 'groupCollapsed' : 'group'](`${namespace}${stageStr}${name}`)
    records.forEach((record) => {
      if (isGroup(record)) {
        this.printGroup(record.name, record.records, record.collapsed)
      } else {
        const { message, time, level, stage } = record
        this.print(message, level, stage, true)
      }
    })
    console.groupEnd()
  }

  group(name: string): LogGroup {
    return new LogGroup(name, this)
  }
}

export class LogGroup extends Log {
  private records: RecordType[] = []
  constructor(name: string, private parent: Log | LogGroup, private collapsed: boolean = false) {
    super(name)
  }

  print(message: any[], level: LogLevel, stage: string | undefined = this.curStage): void {
    this.records.push({
      stage,
      message,
      level,
      time: new Date(),
    })
  }

  printGroup(name: string, records: RecordType[], collapsed: boolean): void {
    this.records.push({
      name,
      records,
      collapsed,
    })
  }

  end(): void {
    this.parent.printGroup(this.namespace, this.records, this.collapsed)
    const endedWarn = (): void => {
      console.warn(`group ${this.namespace} is ended`)
    }
    this.print = endedWarn
    this.end = endedWarn
  }
}

export default Log
