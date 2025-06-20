# Better Stack Integration

This document describes the Better Stack logging integration for the Command Center application.

## Overview

Better Stack (formerly Logtail) provides real-time log aggregation and monitoring. This integration allows you to send structured logs from your Next.js application to Better Stack for centralized logging and monitoring.

## Configuration

The integration is configured in `lib/betterstack.ts` with the following settings:

- **Source Token**: `WHoyHL4Usr9vAvWetfncVcFX`
- **Endpoint**: `https://s1354177.eu-nbg-2.betterstackdata.com`
- **App Name**: `CmdCtr Next.js`
- **Environment**: Automatically detected from Next.js data or defaults to 'development'

## Installation

The required package is already installed:

```bash
npm install @logtail/browser --legacy-peer-deps
```

## Usage

### Basic Logging

Import the logging functions in your components or API routes:

```typescript
import { logInfo, logError, logWarn, logDebug } from '../lib/betterstack';
```

### Log Levels

#### Info Logging
```typescript
await logInfo('User logged in successfully', {
  userId: '123',
  method: 'email',
  timestamp: new Date().toISOString()
});
```

#### Error Logging
```typescript
try {
  // Your code here
} catch (error) {
  await logError(error, { 
    component: 'UserProfile',
    action: 'updateProfile',
    userId: '123'
  });
}
```

#### Warning Logging
```typescript
await logWarn('API rate limit approaching', {
  endpoint: '/api/users',
  remainingCalls: 5,
  resetTime: '2024-01-01T00:00:00Z'
});
```

#### Debug Logging
```typescript
await logDebug('Component state updated', {
  component: 'Dashboard',
  state: { isLoading: false, data: {...} },
  timestamp: new Date().toISOString()
});
```

### React Component Integration

Example of integrating logging in a React component:

```typescript
import { useEffect } from 'react';
import { logInfo, logError } from '../lib/betterstack';

export default function UserProfile({ userId }: { userId: string }) {
  useEffect(() => {
    // Log component mount
    logInfo('UserProfile component mounted', { userId });
  }, [userId]);

  const handleUpdateProfile = async (data: any) => {
    try {
      // Update profile logic
      await updateProfile(data);
      
      await logInfo('Profile updated successfully', {
        userId,
        updatedFields: Object.keys(data)
      });
    } catch (error) {
      await logError(error as Error, {
        component: 'UserProfile',
        action: 'updateProfile',
        userId,
        data
      });
    }
  };

  return (
    // Component JSX
  );
}
```

### API Route Integration

Example of integrating logging in an API route:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { logInfo, logError } from '../../lib/betterstack';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, url, body } = req;

  try {
    await logInfo('API request received', {
      method,
      url,
      body: method === 'POST' ? body : undefined,
      timestamp: new Date().toISOString()
    });

    // Your API logic here
    const result = await processRequest(req);

    await logInfo('API request completed successfully', {
      method,
      url,
      result: result.id
    });

    res.status(200).json(result);
  } catch (error) {
    await logError(error as Error, {
      method,
      url,
      body: method === 'POST' ? body : undefined
    });

    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Testing

Visit `/test-betterstack` to test the integration. This page will send test logs of all levels to Better Stack.

## Dashboard Access

Logs will appear in your Better Stack dashboard at the configured endpoint. You can:

1. View real-time logs
2. Set up alerts and notifications
3. Create custom dashboards
4. Filter logs by level, context, or custom fields

## Environment Variables

The integration automatically detects the environment, but you can also set these environment variables:

```env
NEXT_PUBLIC_BETTERSTACK_SOURCE_TOKEN=your_source_token
NEXT_PUBLIC_BETTERSTACK_ENDPOINT=your_endpoint
NODE_ENV=development|staging|production
```

## Browser Compatibility

The integration only works in browser environments. Server-side rendering (SSR) will fall back to console logging.

## Error Handling

The integration includes built-in error handling:

- If the logger is not available (SSR), logs are sent to console
- If sending to Better Stack fails, errors are logged to console
- All logging functions are async and should be awaited

## Best Practices

1. **Structured Logging**: Always include relevant context in your logs
2. **Error Boundaries**: Use React error boundaries with logging
3. **Performance**: Don't log sensitive information
4. **Rate Limiting**: Be mindful of log volume
5. **Environment**: Use appropriate log levels for different environments

## Troubleshooting

### Logs not appearing in dashboard
- Check your source token and endpoint configuration
- Verify network connectivity
- Check browser console for error messages

### SSR issues
- The logger only works in browser environments
- Server-side logs will appear in console only

### Performance issues
- Consider batching logs for high-volume scenarios
- Use appropriate log levels (debug for development only) 