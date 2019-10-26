"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const winstonLogger = winston_1.createLogger({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: `monitoring.error.log`, level: 'error' }),
        new winston_1.transports.File({ filename: `monitoring.log` }),
    ],
});
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    // with the colorized simple format.
    winstonLogger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({
            format: 'HH:mm:ss',
        }), winston_1.format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`)),
    }));
}
exports.default = winstonLogger;
//# sourceMappingURL=logger.js.map