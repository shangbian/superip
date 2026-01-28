import fs from 'fs';
import path from 'path';

export class Logger {
    private logDir: string;

    constructor(logDir: string = '../../../logs') {
        this.logDir = path.resolve(__dirname, logDir);
        this.ensureLogDir();
    }

    private ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    private formatDate(): string {
        return new Date().toISOString();
    }

    private writeLog(level: string, message: string, data?: any) {
        const logMessage = {
            timestamp: this.formatDate(),
            level,
            message,
            data
        };

        const logString = JSON.stringify(logMessage) + '\n';

        // 输出到控制台
        console.log(`[${level}] ${message}`, data || '');

        // 写入文件
        const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
        fs.appendFileSync(logFile, logString);
    }

    info(message: string, data?: any) {
        this.writeLog('INFO', message, data);
    }

    error(message: string, data?: any) {
        this.writeLog('ERROR', message, data);
    }

    warn(message: string, data?: any) {
        this.writeLog('WARN', message, data);
    }

    debug(message: string, data?: any) {
        this.writeLog('DEBUG', message, data);
    }
}

export const logger = new Logger();
