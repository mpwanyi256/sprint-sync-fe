import { routing } from '@/libs/I18nRouting';

export const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export const getI18nPath = (path: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return path || '/';
  }

  return `${locale}${path.startsWith('/') ? path : `/${path}`}`;
};
