/**
 * Better Stack Logger Configuration
 * Clean implementation for browser logging (no external dependencies)
 * See docs/BETTERSTACK-INTEGRATION.md for usage and best practices.
 */

const config = {
  sourceToken: process.env.NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN || 'WHoyHL4Usr9vAvWetfncVcFX',
  endpoint: process.env.NEXT_PUBLIC_BETTERSTACK_ENDPOINT || 'https://s1354177.eu-nbg-2.betterstackdata.com',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'CmdCtr Next.js',
  environment: typeof process !== 'undefined' && process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
};

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogContext {
  [key: string]: any;
}

async function sendLog(level: LogLevel, message: string, context: LogContext = {}) {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV !== 'production') {
      // Fallback: log to console in SSR/dev
      // eslint-disable-next-line no-console
      console[level](`[Better Stack] [SSR] ${message}`, context);
    }
    return;
  }

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.sourceToken}`,
      },
      body: JSON.stringify({
        dt: new Date().toISOString(),
        level,
        message,
        context: {
          ...context,
          environment: config.environment,
          appName: config.appName,
          url: window.location.href,
          userAgent: window.navigator.userAgent,
        },
      }),
    });

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[Better Stack] Failed to send ${level} log:`, response.statusText);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[Better Stack] Error sending log:', error);
  }
}

export async function logError(error: Error, context: LogContext = {}) {
  await sendLog('error', error.message, {
    ...context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
}

export async function logInfo(message: string, context: LogContext = {}) {
  await sendLog('info', message, context);
}

export async function logWarn(message: string, context: LogContext = {}) {
  await sendLog('warn', message, context);
}

export async function logDebug(message: string, context: LogContext = {}) {
  await sendLog('debug', message, context);
} 