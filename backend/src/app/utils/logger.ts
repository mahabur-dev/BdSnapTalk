// ============================================
// FILE: src/utils/logger.ts
// ============================================

type LogMethod = (message: string, ...args: unknown[]) => void;

const colors = {
  info: '\x1b[36m',
  error: '\x1b[31m',
  warn: '\x1b[33m',
  reset: '\x1b[0m',
} as const;

interface Logger {
  info: LogMethod;
  error: LogMethod;
  warn: LogMethod;
}

export const logger: Logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${colors.info}[INFO]${colors.reset}`, message, ...args);
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(`${colors.error}[ERROR]${colors.reset}`, message, ...args);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${colors.warn}[WARN]${colors.reset}`, message, ...args);
  },
};
