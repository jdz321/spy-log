/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

var _a;
/**
 * LogLevel.Log is identical to LogLevel.Info
 * @see https://developers.google.com/web/tools/chrome-devtools/console/reference#level
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Verbose"] = 0] = "Verbose";
    LogLevel[LogLevel["Log"] = 1] = "Log";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
var LOG_FN_MAP = (_a = {},
    _a[LogLevel.Verbose] = 'debug',
    _a[LogLevel.Log] = 'log',
    _a[LogLevel.Info] = 'info',
    _a[LogLevel.Warning] = 'warn',
    _a[LogLevel.Error] = 'error',
    _a);
function isGroup(record) {
    return !!record.name;
}
function getLogFn(level) {
    var console = this.console;
    return console[LOG_FN_MAP[level]].bind(console);
}
var Log = /** @class */ (function () {
    function Log(namespace) {
        this.namespace = namespace;
    }
    Log.prototype.stage = function (str) {
        this.curStage = str;
        return this;
    };
    Log.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.print(args, LogLevel.Verbose);
    };
    Log.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.print(args, LogLevel.Log);
    };
    Log.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.print(args, LogLevel.Info);
    };
    Log.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.print(args, LogLevel.Warning);
    };
    Log.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.print(args, LogLevel.Error);
    };
    Log.prototype.print = function (message, level, stage, inGroup) {
        if (stage === void 0) { stage = this.curStage; }
        var logFn = Log.getLogFn(level);
        var namespace = inGroup ? '' : "[" + this.namespace + "]";
        var stageStr = stage ? "[" + stage + "]" : '';
        logFn.apply(void 0, __spreadArray(["" + namespace + stageStr], message));
    };
    Log.prototype.printGroup = function (name, records, collapsed) {
        var _this = this;
        var namespace = "[" + this.namespace + "]";
        var stageStr = this.curStage ? "[" + this.curStage + "]" : '';
        console[collapsed ? 'groupCollapsed' : 'group']("" + namespace + stageStr + name);
        records.forEach(function (record) {
            if (isGroup(record)) {
                _this.printGroup(record.name, record.records, record.collapsed);
            }
            else {
                var message = record.message; record.time; var level = record.level, stage = record.stage;
                _this.print(message, level, stage, true);
            }
        });
        console.groupEnd();
    };
    Log.prototype.group = function (name) {
        return new LogGroup(name, this);
    };
    Log.console = console;
    Log.getLogFn = getLogFn;
    return Log;
}());
var LogGroup = /** @class */ (function (_super) {
    __extends(LogGroup, _super);
    function LogGroup(name, parent, collapsed) {
        if (collapsed === void 0) { collapsed = false; }
        var _this = _super.call(this, name) || this;
        _this.parent = parent;
        _this.collapsed = collapsed;
        _this.records = [];
        return _this;
    }
    LogGroup.prototype.print = function (message, level, stage) {
        if (stage === void 0) { stage = this.curStage; }
        this.records.push({
            stage: stage,
            message: message,
            level: level,
            time: new Date(),
        });
    };
    LogGroup.prototype.printGroup = function (name, records, collapsed) {
        this.records.push({
            name: name,
            records: records,
            collapsed: collapsed,
        });
    };
    LogGroup.prototype.end = function () {
        var _this = this;
        this.parent.printGroup(this.namespace, this.records, this.collapsed);
        var endedWarn = function () {
            console.warn("group " + _this.namespace + " is ended");
        };
        this.print = endedWarn;
        this.end = endedWarn;
    };
    return LogGroup;
}(Log));

export default Log;
export { Log, LogGroup, LogLevel };
