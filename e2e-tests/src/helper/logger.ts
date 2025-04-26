import {transports, format} from "winston";

export function options(scenarioName: String) {
    return {
        transports: [
            new transports.File({
                filename: `test-results/logs/${scenarioName}/log.log`,
                level: 'info',
                format: format.combine(
                    format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                    format.align(),
                    format.printf((info: any) => `${info.level}: ${[info.timestamp]}: ${info.message}`)
                )
            }),
        ]
    }
};
