import { createLogger, format, transports } from 'winston';

const winstonLogger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    transports: [
        new transports.File({ filename: `monitoring.error.log`, level: 'error' }),
        new transports.File({ filename: `monitoring.log` }),
    ],
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    // with the colorized simple format.
    winstonLogger.add(
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'HH:mm:ss',
                }),
                format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`),
            ),
        }),
    );
}

export default winstonLogger;
