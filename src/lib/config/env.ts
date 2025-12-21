export const ENV = {
  API_BASE_URL: (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.18.89:4000/api').replace(/\/$/, ''),
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
