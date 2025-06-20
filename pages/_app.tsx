import { ClerkProvider } from '@clerk/nextjs'
import { AppProps } from 'next/app'
import posthog from 'posthog-js'
import { useEffect } from 'react'

import { logInfo, logError } from '../lib/betterstack'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize PostHog
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
      })
    }

    // Log application start
    logInfo('Application started', {
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    }).catch(console.error)

    // Global error handler
    const originalOnError = window.onerror
    window.onerror = async (message, source, lineno, colno, error) => {
      await logError(error || new Error(message as string), {
        source,
        lineno,
        colno,
        url: window.location.href,
      }).catch(console.error)
      
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error)
      }
      return false
    }

    // Unhandled promise rejection handler
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = async (event) => {
      await logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        type: 'unhandledRejection',
        url: window.location.href,
      }).catch(console.error)
      
      if (originalOnUnhandledRejection) {
        return originalOnUnhandledRejection.call(window, event)
      }
    }
  }, [])

  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
} 