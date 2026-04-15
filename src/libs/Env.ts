export const Env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!Env.NEXT_PUBLIC_API_URL || !Env.NEXT_PUBLIC_API_KEY) {
  console.warn(
    'Missing NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_KEY environment variables.'
  );
}
