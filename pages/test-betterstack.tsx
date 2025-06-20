import { useEffect, useState } from 'react';

import { logInfo, logError, logWarn, logDebug } from '../lib/betterstack';

export default function TestBetterStack() {
  const [status, setStatus] = useState({
    info: false,
    warn: false,
    debug: false,
    error: false,
  });

  useEffect(() => {
    // Test different log levels
    const testLogging = async () => {
      try {
        // Test info logging
        await logInfo('Test info message from Next.js app', {
          testType: 'info',
          timestamp: new Date().toISOString(),
        });
        setStatus(prev => ({ ...prev, info: true }));

        // Test warning logging
        await logWarn('Test warning message from Next.js app', {
          testType: 'warning',
          timestamp: new Date().toISOString(),
        });
        setStatus(prev => ({ ...prev, warn: true }));

        // Test debug logging
        await logDebug('Test debug message from Next.js app', {
          testType: 'debug',
          timestamp: new Date().toISOString(),
        });
        setStatus(prev => ({ ...prev, debug: true }));

        // Test error logging
        await logError(new Error('Test error message from Next.js app'), {
          testType: 'error',
          timestamp: new Date().toISOString(),
        });
        setStatus(prev => ({ ...prev, error: true }));

        console.log('All test logs sent to Better Stack!');
      } catch (error) {
        console.error('Error testing Better Stack:', error);
      }
    };

    testLogging();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Better Stack Test</h1>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                status.info ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {status.info ? '✅' : '⏳'}
              </div>
              <span className="text-gray-700">Info log sent</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                status.warn ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {status.warn ? '✅' : '⏳'}
              </div>
              <span className="text-gray-700">Warning log sent</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                status.debug ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {status.debug ? '✅' : '⏳'}
              </div>
              <span className="text-gray-700">Debug log sent</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                status.error ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {status.error ? '✅' : '⏳'}
              </div>
              <span className="text-gray-700">Error log sent</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Next steps:</strong> Check your Better Stack dashboard to see these test logs appearing in real-time.
            </p>
          </div>

          <div className="mt-6">
            <a 
              href="/dashboard" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 