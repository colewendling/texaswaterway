if (process.env.NODE_ENV !== 'development') {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  });
}
