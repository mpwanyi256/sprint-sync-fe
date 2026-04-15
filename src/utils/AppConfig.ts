import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
  name: 'Sprint Sync',
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localePrefix,
  },
} as const;
