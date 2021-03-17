/// <reference types="node" />
/**
 * LogLevel.Log is identical to LogLevel.Info
 * @see https://developers.google.com/web/tools/chrome-devtools/console/reference#level
 */
export declare enum LogLevel {
    Verbose = 0,
    Log = 1,
    Info = 2,
    Warning = 3,
    Error = 4
}
export interface LogRecord {
    /**
     * stage of a log-record
     * @example
     * [namespace][stage]message
     */
    stage?: string;
    /** messages to print */
    message: any[];
    level: LogLevel;
    time: Date;
}
export interface GroupRecord {
    /**
     * name of a log-group
     * @example
     * > [namespace]name
     * ····[stage]message in a group
     */
    name: string;
    /**
     * except the group is initially collapsed when it's logged to the Console
     */
    collapsed: boolean;
    /**
     * records in a log-group
     */
    records: RecordType[];
}
/**
 * Log-records stored in LogGroup.records
 */
export declare type RecordType = LogRecord | GroupRecord;
declare function getLogFn(this: typeof Log, level: LogLevel): (...data: any[]) => void;
export declare class Log {
    protected namespace: string;
    static console: Console;
    static getLogFn: typeof getLogFn;
    constructor(namespace: string);
    protected curStage?: string;
    stage(str: string): this;
    debug(...args: any[]): void;
    log(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    print(message: any[], level: LogLevel, stage?: string | undefined, inGroup?: boolean): void;
    printGroup(name: string, records: RecordType[], collapsed: boolean): void;
    group(name: string): LogGroup;
}
export declare class LogGroup extends Log {
    private parent;
    private collapsed;
    private records;
    constructor(name: string, parent: Log | LogGroup, collapsed?: boolean);
    print(message: any[], level: LogLevel, stage?: string | undefined): void;
    printGroup(name: string, records: RecordType[], collapsed: boolean): void;
    end(): void;
}
export default Log;
