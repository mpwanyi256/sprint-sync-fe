export const app = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
};

export const isDev = process.env.NODE_ENV === 'development';

export const publicRoutes: string[] = ['/login', '/', '/signup'];
