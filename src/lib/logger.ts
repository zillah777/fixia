type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    private isDev = process.env.NODE_ENV !== 'production';

    private log(level: LogLevel, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        const logData = {
            timestamp,
            level,
            message,
            ...meta,
        };

        if (this.isDev) {
            const color =
                level === 'error' ? '\x1b[31m' : // Red
                    level === 'warn' ? '\x1b[33m' : // Yellow
                        '\x1b[36m'; // Cyan

            console.log(`${color}[${level.toUpperCase()}] ${message}\x1b[0m`, meta || '');
        } else {
            // In production, this would send data to Sentry, Datadog, etc.
            // For now, we just log to JSON for potential log ingestion
            console.log(JSON.stringify(logData));
        }
    }

    info(message: string, meta?: any) {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: any) {
        this.log('warn', message, meta);
    }

    error(message: string, error?: any) {
        this.log('error', message, { error: error instanceof Error ? error.stack : error });
    }
}

export const logger = new Logger();
