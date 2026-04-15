import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AppToaster } from '@/components/AppToaster';
import { Providers } from '@/components/Providers';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Sprint Sync',
    default: 'Sprint Sync - Premium Project Management & Task Tracking',
  },
  description:
    "Boost your team's productivity with Sprint Sync. A modern, fast, and agile Kanban board for seamless project management and task tracking.",
  icons: {
    icon: [{ url: '/icon/logo.svg' }],
    shortcut: ['/icon/logo.svg'],
    apple: [{ url: '/icon/logo.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className='font-sans antialiased'>
        <NextIntlClientProvider messages={messages}>
          <Providers>{props.children}</Providers>
          <AppToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
