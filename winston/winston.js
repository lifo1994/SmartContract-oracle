const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

var logDate = new Date().getTime();

const logger = createLogger({
    format: format.combine(
        timestamp(),
        format.splat(),
        format.simple(),

    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: `./log/${logDate}.log`,
            level: 'info'
        }),
        new transports.File({
            filename: `./log/E${logDate}.log`,
            level: 'error'
        })
    ]
});

logger.log({
    level: 'info',
    message: 'What time is the testing at?'
});

logger.log({
    level: 'error',
    message: 'What time is the testing at!@#$?'
});